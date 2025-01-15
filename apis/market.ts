import { getMarketId } from '../utils/market'
import { fetchCurrency } from '../utils/currency'
import { multiCall } from '../utils/multi-call'
import { CONTRACT_ADDRESSES } from '../constants/contract-addresses'
import { MarketModel } from '../model/market'

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

  return new MarketModel({
    network: chainNetwork,
    tokens: [quoteCurrency, baseCurrency],
    bidBook,
    askBook,
  })
}

const buildBookCacheKey = (chainNetwork: string, bookId: bigint) =>
  `${chainNetwork}:${bookId}`
const isMarketOpenedCache = new Map<string, boolean>()
const getIsMarketOpenedFromCache = (chainNetwork: string, bookId: bigint) =>
  isMarketOpenedCache.get(buildBookCacheKey(chainNetwork, bookId))
const setIsMarketOpenedToCache = (
  chainNetwork: string,
  bookId: bigint,
  isOpened: boolean,
) => isMarketOpenedCache.set(buildBookCacheKey(chainNetwork, bookId), isOpened)

export async function fetchIsMarketOpened(
  chainNetwork: string,
  bookId: bigint,
) {
  const cachedIsMarketOpened = getIsMarketOpenedFromCache(chainNetwork, bookId)
  if (cachedIsMarketOpened !== undefined) {
    return cachedIsMarketOpened
  }
  const isMarketOpened =
    BigInt(
      (
        await multiCall<boolean[]>(chainNetwork, [
          {
            contractAddress: CONTRACT_ADDRESSES[chainNetwork]!.BookManager,
            entrypoint: 'is_opened',
            calldata: [bookId],
          },
        ])
      )[0][0],
    ) > 0n
  if (isMarketOpened) {
    setIsMarketOpenedToCache(chainNetwork, bookId, isMarketOpened)
  }
  return isMarketOpened
}
