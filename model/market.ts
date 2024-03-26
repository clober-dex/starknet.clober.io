import { isAddressEqual } from 'viem'

import { getMarketId } from '../utils/market'
import { CHAIN_IDS } from '../constants/chain'
import {
  baseToQuote,
  divide,
  invertPrice,
  quoteToBase,
  toPrice,
} from '../utils/tick'

import { Book } from './book'
import { Currency } from './currency'
import { Depth, MergedDepth } from './depth'
import { FeePolicy } from './fee-policy'

export class Market {
  id: string
  quote: Currency
  base: Currency
  makerPolicy: FeePolicy
  hooks: `0x${string}`
  takerPolicy: FeePolicy
  latestPrice: number
  latestTimestamp: number
  bids: MergedDepth[]
  asks: MergedDepth[]
  books: Book[]

  constructor({
    chainId,
    tokens,
    makerPolicy,
    hooks,
    takerPolicy,
    latestPrice,
    latestTimestamp,
    books,
  }: {
    chainId: CHAIN_IDS
    tokens: [Currency, Currency]
    makerPolicy: FeePolicy
    hooks: `0x${string}`
    takerPolicy: FeePolicy
    latestPrice: number
    latestTimestamp: number
    books: Book[]
  }) {
    const { marketId, quote, base } = getMarketId(
      chainId,
      tokens.map((token) => token.address),
    )
    this.id = marketId
    this.quote = tokens.find((token) => isAddressEqual(token.address, quote))!
    this.base = tokens.find((token) => isAddressEqual(token.address, base))!
    this.makerPolicy = makerPolicy
    this.hooks = hooks
    this.takerPolicy = takerPolicy
    this.latestPrice = latestPrice
    this.latestTimestamp = latestTimestamp
    this.bids = books
      .filter((book) => isAddressEqual(book.quote.address, this.quote.address))
      .flatMap((book) => book.depths)
      .map(
        (depth) =>
          ({
            tick: depth.tick,
            price: depth.price,
            rawAmount: depth.rawAmount,
            baseAmount: depth.baseAmount,
          }) as MergedDepth,
      )
    this.asks = books
      .filter((book) => isAddressEqual(book.quote.address, this.base.address))
      .flatMap((book) => book.depths)
      .map(
        (depth) =>
          ({
            tick: depth.tick,
            price: depth.price,
            rawAmount: depth.rawAmount,
            baseAmount: depth.baseAmount,
          }) as MergedDepth,
      )
    this.books = books
  }

  take = ({
    takeQuote,
    limitPrice,
    amountOut, // quote if takeQuote, base otherwise
  }: {
    takeQuote: boolean
    limitPrice: bigint
    amountOut: bigint
  }) => {
    if (takeQuote) {
      const bidDepths = this.books
        .filter((book) =>
          isAddressEqual(book.quote.address, this.quote.address),
        )
        .flatMap((book) => book.depths)
      return this.takeInner({ depths: bidDepths, limitPrice, amountOut })
    } else {
      const askDepths = this.books
        .filter((book) => isAddressEqual(book.quote.address, this.base.address))
        .flatMap((book) => book.depths)
      return this.takeInner({
        depths: askDepths,
        limitPrice: invertPrice(limitPrice),
        amountOut,
      })
    }
  }

  spend = ({
    spendBase,
    limitPrice,
    amountIn, // base if spendBase, quote otherwise
  }: {
    spendBase: boolean
    limitPrice: bigint
    amountIn: bigint
  }) => {
    if (spendBase) {
      const bidDepths = this.books
        .filter((book) =>
          isAddressEqual(book.quote.address, this.quote.address),
        )
        .flatMap((book) => book.depths)
      return this.spendInner({ depths: bidDepths, limitPrice, amountIn })
    } else {
      const askDepths = this.books
        .filter((book) => isAddressEqual(book.quote.address, this.base.address))
        .flatMap((book) => book.depths)
      return this.spendInner({
        depths: askDepths,
        limitPrice: invertPrice(limitPrice),
        amountIn,
      })
    }
  }

  takeInner = ({
    depths, // only bid orders
    limitPrice,
    amountOut, // quote
  }: {
    depths: Depth[]
    limitPrice: bigint
    amountOut: bigint
  }) => {
    if (depths.length === 0) {
      return {}
    }
    const takeResult: {
      [key in string]: {
        takenQuoteAmount: bigint
        spendBaseAmount: bigint
      }
    } = {}
    for (const depth of depths) {
      if (!takeResult[depth.bookId]) {
        takeResult[depth.bookId] = {
          takenQuoteAmount: 0n,
          spendBaseAmount: 0n,
        }
      }
    }
    let totalTakenQuoteAmount = 0n

    const ticks = depths
      .sort((a, b) => Number(b.price) - Number(a.price))
      .map((depth) => depth.tick)
    let index = 0
    let tick = ticks[index]
    while (tick > -8388608n) {
      if (limitPrice > toPrice(tick)) {
        break
      }
      const currentDepth = depths.find((depth) => depth.tick === tick)!
      const currentBook = this.books.find(
        (book) => book.id === BigInt(currentDepth.bookId),
      )!
      let maxAmount = this.takerPolicy.usesQuote
        ? this.takerPolicy.calculateOriginalAmount(
            amountOut - totalTakenQuoteAmount,
            true,
          )
        : amountOut - totalTakenQuoteAmount
      maxAmount = divide(maxAmount, currentBook.unit, true)

      if (maxAmount === 0n) {
        break
      }
      let quoteAmount =
        (currentDepth.rawAmount > maxAmount
          ? maxAmount
          : currentDepth.rawAmount) * currentBook.unit
      let baseAmount = quoteToBase(tick, quoteAmount, true)
      if (this.takerPolicy.usesQuote) {
        quoteAmount =
          quoteAmount - this.takerPolicy.calculateFee(quoteAmount, false)
      } else {
        baseAmount =
          baseAmount + this.takerPolicy.calculateFee(baseAmount, false)
      }
      if (quoteAmount === 0n) {
        break
      }

      takeResult[currentDepth.bookId].takenQuoteAmount += quoteAmount
      takeResult[currentDepth.bookId].spendBaseAmount += baseAmount
      totalTakenQuoteAmount += quoteAmount
      if (amountOut <= totalTakenQuoteAmount) {
        break
      }
      index++
      tick = ticks[index]
    }
    return takeResult
  }

  spendInner = ({
    depths, // only bid orders
    limitPrice,
    amountIn, // base
  }: {
    depths: Depth[]
    limitPrice: bigint
    amountIn: bigint
  }) => {
    if (depths.length === 0) {
      return {}
    }
    const spendResult: {
      [key in string]: {
        takenQuoteAmount: bigint
        spendBaseAmount: bigint
      }
    } = {}
    for (const depth of depths) {
      if (!spendResult[depth.bookId]) {
        spendResult[depth.bookId] = {
          takenQuoteAmount: 0n,
          spendBaseAmount: 0n,
        }
      }
    }
    let totalSpendBaseAmount = 0n

    const ticks = depths
      .sort((a, b) => Number(b.price) - Number(a.price))
      .map((depth) => depth.tick)
    let index = 0
    let tick = ticks[index]
    while (totalSpendBaseAmount <= amountIn && tick > -8388608n) {
      if (limitPrice > toPrice(tick)) {
        break
      }
      const currentDepth = depths.find((depth) => depth.tick === tick)!
      const currentBook = this.books.find(
        (book) => book.id === BigInt(currentDepth.bookId),
      )!
      let maxAmount = this.takerPolicy.usesQuote
        ? amountIn - totalSpendBaseAmount
        : this.takerPolicy.calculateOriginalAmount(
            amountIn - totalSpendBaseAmount,
            false,
          )
      maxAmount = baseToQuote(tick, maxAmount, false) / currentBook.unit

      if (maxAmount === 0n) {
        break
      }
      let quoteAmount =
        (currentDepth.rawAmount > maxAmount
          ? maxAmount
          : currentDepth.rawAmount) * currentBook.unit
      let baseAmount = quoteToBase(tick, quoteAmount, true)
      if (this.takerPolicy.usesQuote) {
        quoteAmount =
          quoteAmount - this.takerPolicy.calculateFee(quoteAmount, false)
      } else {
        baseAmount =
          baseAmount + this.takerPolicy.calculateFee(baseAmount, false)
      }
      if (baseAmount === 0n) {
        break
      }

      spendResult[currentDepth.bookId].takenQuoteAmount += quoteAmount
      spendResult[currentDepth.bookId].spendBaseAmount += baseAmount
      totalSpendBaseAmount += baseAmount
      index++
      tick = ticks[index]
    }
    return spendResult
  }
}
