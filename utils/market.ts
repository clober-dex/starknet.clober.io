import { Market } from '../model/market'

import { isCurrencyEqual } from './currency'

export const isMarketEqual = (a: Market | undefined, b: Market | undefined) => {
  if (!a || !b) {
    return false
  }
  return (
    a.network === b.network &&
    isCurrencyEqual(a.quote, b.quote) &&
    isCurrencyEqual(a.base, b.base)
  )
}
