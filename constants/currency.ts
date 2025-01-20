import { sepolia } from '@starknet-react/chains'

import { Currency } from '../model/currency'

export const WHITELISTED_CURRENCIES: {
  [chain in string]: Currency[]
} = {
  [sepolia.network]: [
    {
      address:
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    {
      address:
        '0x0294ac7d3d0197d637a408eaeb43a8902fa761206aa5d17cdca0ba0e062bf1f1',
      name: 'Mock USDC',
      symbol: 'USDC',
      decimals: 6,
      icon: '/usd-coin-usdc-logo.png',
    },
  ],
}

export const DEFAULT_INPUT_CURRENCY: {
  [network: string]: Currency
} = {
  [sepolia.network]: {
    address:
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
}

export const DEFAULT_OUTPUT_CURRENCY: {
  [network: string]: Currency
} = {
  [sepolia.network]: {
    address:
      '0x0294ac7d3d0197d637a408eaeb43a8902fa761206aa5d17cdca0ba0e062bf1f1',
    name: 'Mock USDC',
    symbol: 'USDC',
    decimals: 6,
    icon: '/usd-coin-usdc-logo.png',
  },
}

export const ETH_ADDRESS: {
  [network: string]: `0x${string}`
} = {
  [sepolia.network]:
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
}

// @dev: https://defillama.com/stablecoin
// order by total circulating supply (over $40M)
export const STABLE_COIN_ADDRESSES: {
  [network: string]: `0x${string}`[]
} = {
  [sepolia.network]: [
    '0x0294ac7d3d0197d637a408eaeb43a8902fa761206aa5d17cdca0ba0e062bf1f1', // USDC
  ],
}
