import { invertTick, toPrice } from '../utils/tick'
import { isAddressEqual } from '../utils/address'
import { MAKER_DEFAULT_POLICY, TAKER_DEFAULT_POLICY } from '../constants/fee'
import { quoteToBase } from '../utils/decimals'
import { formatPrice } from '../utils/prices'
import { formatUnits } from '../utils/bigint'
import { getMarketId } from '../utils/market'

import { Depth } from './depth'
import { Currency } from './currency'
import { Book } from './book'

export type Market = {
  network: string
  quote: Currency
  base: Currency
  makerFee: number
  takerFee: number
  bids: {
    price: string
    tick: number
    baseAmount: string
  }[]
  bidBook: {
    id: string
    base: Currency
    unitSize: string
    quote: Currency
    isOpened: boolean
  }
  asks: {
    price: string
    tick: number
    baseAmount: string
  }[]
  askBook: {
    id: string
    base: Currency
    unitSize: string
    quote: Currency
    isOpened: boolean
  }
}

export class MarketModel {
  network: string
  makerFee: number
  takerFee: number

  id: string
  quote: Currency
  base: Currency
  bids: Depth[]
  asks: Depth[]
  bidBook: Book
  askBook: Book

  constructor({
    network,
    tokens,
    bidBook,
    askBook,
  }: {
    network: string
    tokens: [Currency, Currency]
    bidBook: Book
    askBook: Book
  }) {
    this.network = network
    const { marketId, quoteTokenAddress, baseTokenAddress } = getMarketId(
      network,
      tokens.map((token) => token.address),
    )
    this.id = marketId
    this.quote = tokens.find((token) =>
      isAddressEqual(token.address, quoteTokenAddress!),
    )!
    this.base = tokens.find((token) =>
      isAddressEqual(token.address, baseTokenAddress!),
    )!

    this.makerFee = (Number(MAKER_DEFAULT_POLICY[network].rate) * 100) / 1e6
    this.takerFee = (Number(TAKER_DEFAULT_POLICY[network].rate) * 100) / 1e6

    this.bids = bidBook.depths.map(
      (depth) =>
        ({
          price: formatPrice(
            toPrice(depth.tick),
            this.quote.decimals,
            this.base.decimals,
          ),
          tick: depth.tick,
          baseAmount: quoteToBase(
            depth.tick,
            depth.unitAmount * bidBook.unitSize,
            false,
          ),
        }) as Depth,
    )

    this.asks = askBook.depths.map((depth) => {
      const price = toPrice(invertTick(depth.tick))
      const readablePrice = formatPrice(
        price,
        this.quote.decimals,
        this.base.decimals,
      )
      const baseAmount = depth.unitAmount * askBook.unitSize
      return {
        price: readablePrice,
        tick: depth.tick,
        baseAmount,
      } as Depth
    })

    this.bidBook = bidBook
    this.askBook = askBook
  }

  take = ({
    takeQuote,
    limitTick,
    amountOut, // quote if takeQuote, base otherwise
  }: {
    takeQuote: boolean
    limitTick: bigint
    amountOut: bigint
  }) => {
    if (takeQuote) {
      return {
        bookId: this.bidBook.id,
        ...this.bidBook.take({
          limitTick,
          amountOut,
        }),
      }
    } else {
      return {
        bookId: this.askBook.id,
        ...this.askBook.take({
          limitTick: invertTick(limitTick),
          amountOut,
        }),
      }
    }
  }

  spend = ({
    spentBase,
    limitTick,
    amountIn, // base if spentBase, quote otherwise
  }: {
    spentBase: boolean
    limitTick: bigint
    amountIn: bigint
  }) => {
    if (spentBase) {
      return {
        bookId: this.bidBook.id,
        ...this.bidBook.spend({
          limitTick,
          amountIn,
        }),
      }
    } else {
      return {
        bookId: this.askBook.id,
        ...this.askBook.spend({
          limitTick: invertTick(limitTick),
          amountIn,
        }),
      }
    }
  }

  toJson = (): Market => {
    return {
      network: this.network,
      quote: this.quote,
      base: this.base,
      makerFee: this.makerFee,
      takerFee: this.takerFee,
      bids: this.bids.map(({ price, tick, baseAmount }) => ({
        price,
        tick: Number(tick),
        baseAmount: formatUnits(baseAmount, this.base.decimals),
      })),
      bidBook: {
        id: this.bidBook.id.toString(),
        base: this.bidBook.base,
        unitSize: this.bidBook.unitSize.toString(),
        quote: this.bidBook.quote,
        isOpened: this.bidBook.isOpened,
      },
      asks: this.asks.map(({ price, tick, baseAmount }) => ({
        price,
        tick: Number(tick),
        baseAmount: formatUnits(baseAmount, this.base.decimals),
      })),
      askBook: {
        id: this.askBook.id.toString(),
        base: this.askBook.base,
        unitSize: this.askBook.unitSize.toString(),
        quote: this.askBook.quote,
        isOpened: this.askBook.isOpened,
      },
    }
  }
}
