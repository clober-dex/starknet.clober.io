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
        '0x033566df80eb40d0183decd084e9f01ec4ff598889b695f6dc80699dae57b4f3',
      name: 'Mock Token',
      symbol: 'MOCK',
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
      '0x033566df80eb40d0183decd084e9f01ec4ff598889b695f6dc80699dae57b4f3',
    name: 'Mock Token',
    symbol: 'MOCK',
    decimals: 18,
    icon: '/starknet-logo.png',
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
    '0x0028729b12ce1140cbc1e7cbc7245455d3c15fa0c7f5d2e9fc8e0441567f6b50', // USDC
    '0x3913d184e537671dfeca3f67015bb845f2d12a26e5ec56bdc495913b20acb08', // USDT
  ],
}
