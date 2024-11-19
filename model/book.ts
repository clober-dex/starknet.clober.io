import { TAKER_DEFAULT_POLICY } from '../constants/fee'
import { divide } from '../utils/math'
import { MIN_TICK } from '../constants/tick'
import { baseToQuote, quoteToBase } from '../utils/decimals'

import { Currency } from './currency'
import { DepthDto } from './depth'

export class Book {
  network: string
  id: bigint
  base: Currency
  unitSize: bigint
  quote: Currency
  depths: DepthDto[]
  isOpened: boolean

  constructor({
    network,
    id,
    base,
    quote,
    unitSize,
    depths,
    isOpened,
  }: {
    network: string
    id: bigint
    base: Currency
    quote: Currency
    unitSize: bigint
    depths: DepthDto[]
    isOpened: boolean
  }) {
    this.network = network
    this.id = id
    this.base = base
    this.unitSize = unitSize
    this.quote = quote
    this.depths = depths
    this.isOpened = isOpened
  }

  take = ({
    limitTick,
    amountOut, // quote
  }: {
    limitTick: bigint
    amountOut: bigint
  }) => {
    const events: {
      tick: bigint
      takenQuoteAmount: bigint
      spentBaseAmount: bigint
    }[] = []
    let takenQuoteAmount = 0n
    let spentBaseAmount = 0n
    if (this.depths.length === 0) {
      return {
        takenQuoteAmount,
        spentBaseAmount,
        events,
      }
    }

    const ticks = this.depths
      .sort((a, b) => Number(b.tick) - Number(a.tick))
      .map((depth) => depth.tick)
    let index = 0
    let tick = ticks[index]!
    while (tick >= MIN_TICK) {
      if (limitTick > tick) {
        break
      }
      let maxAmount = TAKER_DEFAULT_POLICY[this.network].usesQuote
        ? TAKER_DEFAULT_POLICY[this.network].calculateOriginalAmount(
            amountOut - takenQuoteAmount,
            true,
          )
        : amountOut - takenQuoteAmount
      maxAmount = divide(maxAmount, this.unitSize, true)

      if (maxAmount === 0n) {
        break
      }
      const currentDepth = this.depths.find((depth) => depth.tick === tick)!
      let quoteAmount =
        (currentDepth.unitAmount > maxAmount
          ? maxAmount
          : currentDepth.unitAmount) * this.unitSize
      let baseAmount = quoteToBase(tick, quoteAmount, true)
      if (TAKER_DEFAULT_POLICY[this.network].usesQuote) {
        quoteAmount =
          quoteAmount -
          TAKER_DEFAULT_POLICY[this.network].calculateFee(quoteAmount, false)
      } else {
        baseAmount =
          baseAmount +
          TAKER_DEFAULT_POLICY[this.network].calculateFee(baseAmount, false)
      }
      if (quoteAmount === 0n) {
        break
      }
      events.push({
        tick,
        takenQuoteAmount: quoteAmount,
        spentBaseAmount: baseAmount,
      })
      takenQuoteAmount += quoteAmount
      spentBaseAmount += baseAmount
      if (amountOut <= takenQuoteAmount) {
        break
      }
      index++
      tick = ticks[index]!
    }
    return {
      takenQuoteAmount,
      spentBaseAmount,
      events,
    }
  }

  spend = ({
    limitTick,
    amountIn, // base
  }: {
    limitTick: bigint
    amountIn: bigint
  }) => {
    const events: {
      tick: bigint
      takenQuoteAmount: bigint
      spentBaseAmount: bigint
    }[] = []
    let takenQuoteAmount = 0n
    let spentBaseAmount = 0n
    if (this.depths.length === 0) {
      return {
        takenQuoteAmount,
        spentBaseAmount,
        events,
      }
    }

    const ticks = this.depths
      .sort((a, b) => Number(b.tick) - Number(a.tick))
      .map((depth) => depth.tick)
    let index = 0
    let tick = ticks[index]!
    while (spentBaseAmount <= amountIn && tick >= MIN_TICK) {
      if (limitTick > tick) {
        break
      }
      let maxAmount = TAKER_DEFAULT_POLICY[this.network].usesQuote
        ? amountIn - spentBaseAmount
        : TAKER_DEFAULT_POLICY[this.network].calculateOriginalAmount(
            amountIn - spentBaseAmount,
            false,
          )
      maxAmount = baseToQuote(tick, maxAmount, false) / this.unitSize

      if (maxAmount === 0n) {
        break
      }
      const currentDepth = this.depths.find((depth) => depth.tick === tick)!
      let quoteAmount =
        (currentDepth.unitAmount > maxAmount
          ? maxAmount
          : currentDepth.unitAmount) * this.unitSize
      let baseAmount = quoteToBase(tick, quoteAmount, true)
      if (TAKER_DEFAULT_POLICY[this.network].usesQuote) {
        quoteAmount =
          quoteAmount -
          TAKER_DEFAULT_POLICY[this.network].calculateFee(quoteAmount, false)
      } else {
        baseAmount =
          baseAmount +
          TAKER_DEFAULT_POLICY[this.network].calculateFee(baseAmount, false)
      }
      if (baseAmount === 0n) {
        break
      }
      events.push({
        tick,
        takenQuoteAmount: quoteAmount,
        spentBaseAmount: baseAmount,
      })
      takenQuoteAmount += quoteAmount
      spentBaseAmount += baseAmount
      index++
      tick = ticks[index]!
    }
    return {
      takenQuoteAmount,
      spentBaseAmount,
      events,
    }
  }
}
