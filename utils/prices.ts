import BigNumber from 'bignumber.js'

import { MAX_PRICE, MIN_PRICE, PRICE_PRECISION } from '../constants/price'
import { Currency } from '../model/currency'

import { fromPrice, invertTick, toPrice } from './tick'
import { max, min } from './bigint'
import { findFirstNonZeroIndex } from './bignumber'

BigNumber.config({
  DECIMAL_PLACES: 100,
})

export const getPriceDecimals = (price: number, r: number = 1.0001) => {
  const priceNumber = new BigNumber(price)
  const priceDiff = new BigNumber(r)
    .multipliedBy(priceNumber)
    .minus(priceNumber)
  return findFirstNonZeroIndex(priceDiff) + 1
}

// @dev: Use this function only for display purposes not logic
export const formatPrice = (
  price: bigint,
  quoteDecimals: number,
  baseDecimals: number,
): string => {
  return new BigNumber(price.toString())
    .div(new BigNumber(2).pow(PRICE_PRECISION.toString()))
    .times(new BigNumber(10).pow(baseDecimals))
    .div(new BigNumber(10).pow(quoteDecimals))
    .toFixed()
}

export const convertHumanReadablePriceToRawPrice = (
  humanReadablePrice: number,
  quoteDecimals: number,
  baseDecimals: number,
): bigint => {
  const value = new BigNumber(humanReadablePrice)
    .times(new BigNumber(2).pow(PRICE_PRECISION.toString()))
    .times(new BigNumber(10).pow(quoteDecimals))
    .div(new BigNumber(10).pow(baseDecimals))
  const rawPrice = BigInt(
    value.isInteger() ? value.toFixed() : value.integerValue().toFixed(),
  )
  return rawPrice
}

export const parsePrice = (
  humanReadablePrice: number,
  quoteDecimals: number,
  baseDecimals: number,
): {
  roundingDownTick: bigint
  roundingUpTick: bigint
} => {
  const rawPrice = convertHumanReadablePriceToRawPrice(
    humanReadablePrice,
    quoteDecimals,
    baseDecimals,
  )
  const cutOffRawPrice = max(MIN_PRICE, min(rawPrice, MAX_PRICE))
  const tick = fromPrice(cutOffRawPrice)
  const flooredPrice = toPrice(tick)
  if (rawPrice === flooredPrice) {
    return {
      roundingDownTick: tick,
      roundingUpTick: tick,
    }
  }
  return {
    roundingDownTick: tick,
    roundingUpTick: tick + 1n,
  }
}

export const getMarketPrice = ({
  marketQuoteCurrency,
  marketBaseCurrency,
  bidTick,
  askTick,
}: {
  marketQuoteCurrency: Currency
  marketBaseCurrency: Currency
  bidTick?: bigint
  askTick?: bigint
}): string => {
  if (bidTick !== undefined) {
    return formatPrice(
      toPrice(bidTick),
      marketQuoteCurrency.decimals,
      marketBaseCurrency.decimals,
    )
  } else if (askTick !== undefined) {
    return formatPrice(
      toPrice(invertTick(askTick)),
      marketQuoteCurrency.decimals,
      marketBaseCurrency.decimals,
    )
  } else {
    throw new Error('Either bidTick or askTick must be provided')
  }
}
