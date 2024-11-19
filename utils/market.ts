import { getAddress } from '@starknet-react/core'

import { Market } from '../model/market'
import { ETH_ADDRESS, STABLE_COIN_ADDRESSES } from '../constants/currency'

import { isCurrencyEqual } from './currency'
import { isAddressEqual } from './address'

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

export const getMarketId = (
  chainNetwork: string,
  tokenAddresses: `0x${string}`[],
): {
  baseTokenAddress: `0x${string}`
  quoteTokenAddress: `0x${string}`
  marketId: string
} => {
  if (tokenAddresses.length !== 2) {
    throw new Error('Invalid token pair')
  }

  tokenAddresses = tokenAddresses.map((address) => getAddress(address)).sort()

  // include stable coin
  const stable = tokenAddresses.find((address) => {
    return STABLE_COIN_ADDRESSES[chainNetwork]!.map((addresses) =>
      getAddress(addresses),
    ).some((addresses) => addresses.includes(address))
  })
  if (stable) {
    const other = tokenAddresses.find(
      (address) => !isAddressEqual(address, stable),
    )!
    return {
      marketId: `${other}/${stable}`,
      quoteTokenAddress: stable,
      baseTokenAddress: other,
    }
  }

  // include eth
  const eth = tokenAddresses.find((address) =>
    isAddressEqual(address, ETH_ADDRESS[chainNetwork]!),
  )
  if (eth) {
    const other = tokenAddresses.find(
      (address) => !isAddressEqual(address, ETH_ADDRESS[chainNetwork]!),
    )!
    return {
      marketId: `${other}/${eth}`,
      quoteTokenAddress: eth,
      baseTokenAddress: other,
    }
  }

  const _tokens = tokenAddresses.sort((a, b) => a.localeCompare(b))
  return {
    marketId: `${_tokens[0]}/${_tokens[1]}`,
    quoteTokenAddress: _tokens[0]!,
    baseTokenAddress: _tokens[1]!,
  }
}
