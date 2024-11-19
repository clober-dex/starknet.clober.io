import { getAddress } from '@starknet-react/core'

import { getMarketId } from './market'

export const getQuoteToken = ({
  chainNetwork,
  token0,
  token1,
}: {
  chainNetwork: string
  token0: `0x${string}`
  token1: `0x${string}`
}): `0x${string}` => {
  return getAddress(
    getMarketId(chainNetwork, [token0, token1]).quoteTokenAddress,
  )
}
