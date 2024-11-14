import { Currency } from '../model/currency'
import { AGGREGATORS } from '../constants/aggregators'
import { WHITELISTED_CURRENCIES } from '../constants/currency'

export async function fetchWhitelistCurrencies(
  chainNetwork: string,
): Promise<Currency[]> {
  try {
    const currencies = await Promise.all(
      AGGREGATORS[chainNetwork].map((aggregator) => aggregator.currencies()),
    )
    return WHITELISTED_CURRENCIES[chainNetwork]
      .concat(currencies.flat())
      .map((currency) => ({ ...currency, isVerified: true }))
  } catch (e) {
    return WHITELISTED_CURRENCIES[chainNetwork].map((currency) => ({
      ...currency,
      isVerified: true,
    }))
  }
}
