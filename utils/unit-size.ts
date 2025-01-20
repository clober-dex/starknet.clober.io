import { type Currency } from '../model/currency'
import { ETH_ADDRESS } from '../constants/currency'

import { isAddressEqual } from './address'
import { multiCall } from './multi-call'
import { decodeUint256 } from './bigint'

const buildCurrencyCacheKey = (chainNetwork: string, address: `0x${string}`) =>
  `${chainNetwork}:${address}`
const unitSizeCache = new Map<string, bigint>()
const getUnitSizeFromCache = (
  chainNetwork: string,
  address: `0x${string}`,
): bigint | undefined =>
  unitSizeCache.get(buildCurrencyCacheKey(chainNetwork, address))
const setUnitSizeToCache = (
  chainNetwork: string,
  address: `0x${string}`,
  unitSize: bigint,
) => unitSizeCache.set(buildCurrencyCacheKey(chainNetwork, address), unitSize)

export const calculateUnitSize = async (
  chainNetwork: string,
  quote: Currency,
) => {
  const cachedUnitSize = getUnitSizeFromCache(chainNetwork, quote.address)
  if (cachedUnitSize !== undefined) {
    return cachedUnitSize
  }
  const unitSize = await calculateUnitSizeInner(chainNetwork, quote)
  setUnitSizeToCache(chainNetwork, quote.address, unitSize)
  return unitSize
}

const calculateUnitSizeInner = async (
  chainNetwork: string,
  quote: Currency,
) => {
  if (isAddressEqual(quote.address, ETH_ADDRESS[chainNetwork])) {
    return 10n ** 12n
  }
  const results = await multiCall<string[]>(chainNetwork, [
    { contractAddress: quote.address, entrypoint: 'total_supply' },
  ])
  const totalSupply = decodeUint256(results[0])
  return (
    10n **
    BigInt(totalSupply <= 2n ** 64n ? 0n : Math.max(quote.decimals - 6, 0))
  )
}
