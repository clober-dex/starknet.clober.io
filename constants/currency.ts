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
        '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
      name: 'Starknet Token',
      symbol: 'STRK',
      decimals: 18,
      icon: '/starknet-logo.png',
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
      '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
    name: 'Starknet Token',
    symbol: 'STRK',
    decimals: 18,
    icon: '/starknet-logo.png',
  },
}

export const ETH_ADDRESSES: {
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
    '0x0028729b12ce1140cbc1e7cbc7245455d3c15fa0c7f5d2e9fc8e0441567f6b50', // USDC
    '0x3913d184e537671dfeca3f67015bb845f2d12a26e5ec56bdc495913b20acb08', // USDT
  ],
}
