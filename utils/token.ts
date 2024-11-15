import { getAddress } from '@starknet-react/core'

import { ETH_ADDRESS, STABLE_COIN_ADDRESSES } from '../constants/currency'

import { isAddressEqual } from './address'

export const getQuoteToken = ({
  chainNetwork,
  token0,
  token1,
}: {
  chainNetwork: string
  token0: `0x${string}`
  token1: `0x${string}`
}): `0x${string}` => {
  const tokenAddresses = [token0, token1]
    .map((address) => getAddress(address))
    .sort()

  // include stable coin
  const stable = tokenAddresses.find((address) => {
    return STABLE_COIN_ADDRESSES[chainNetwork]!.map((addresses) =>
      getAddress(addresses),
    ).some((addresses) => addresses.includes(address))
  })
  if (stable) {
    return stable
  }

  // include eth
  const eth = tokenAddresses.find((address) =>
    isAddressEqual(address, ETH_ADDRESS[chainNetwork]!),
  )
  if (eth) {
    return eth
  }

  const _tokens = tokenAddresses.sort((a, b) => a.localeCompare(b))
  return _tokens[0]!
}
