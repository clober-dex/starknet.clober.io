import { mainnet } from '@starknet-react/chains'

import { Currency } from '../model/currency'

export const WHITELISTED_CURRENCIES: {
  [chain in string]: Currency[]
} = {
  [mainnet.network]: [
    {
      address:
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    {
      address:
        '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
      name: 'USDC',
      symbol: 'USDC',
      decimals: 6,
      icon: '/usd-coin-usdc-logo.png',
    },
    {
      address:
        '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8',
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      icon: '/tether-usdt-logo.png',
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
  [mainnet.network]: {
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
  [mainnet.network]: {
    address:
      '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    icon: '/usd-coin-usdc-logo.png',
  },
}

export const ETH_ADDRESS: {
  [network: string]: `0x${string}`
} = {
  [mainnet.network]:
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
}

// @dev: https://defillama.com/stablecoin
// order by total circulating supply (over $40M)
export const STABLE_COIN_ADDRESSES: {
  [network: string]: `0x${string}`[]
} = {
  [mainnet.network]: [
    '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // USDC
    '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', // USDT
  ],
}
