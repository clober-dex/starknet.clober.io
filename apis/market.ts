import { getMarketId } from '../utils/market'
import { fetchCurrency } from '../utils/currency'

import { fetchBook } from './book'

export const fetchMarket = async (
  chainNetwork: string,
  tokenAddresses: `0x${string}`[],
  n = 100,
) => {
  if (tokenAddresses.length !== 2) {
    throw new Error('Invalid token pair')
  }

  const { quoteTokenAddress, baseTokenAddress } = getMarketId(chainNetwork, [
    tokenAddresses[0]!,
    tokenAddresses[1]!,
  ])

  const [quoteCurrency, baseCurrency] = await Promise.all([
    fetchCurrency(chainNetwork, quoteTokenAddress),
    fetchCurrency(chainNetwork, baseTokenAddress),
  ])
  const [bidBook, askBook] = await Promise.all([
    fetchBook(chainNetwork, quoteCurrency, baseCurrency, n),
    fetchBook(chainNetwork, baseCurrency, quoteCurrency, n),
  ])
}
