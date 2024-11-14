import { sepolia } from '@starknet-react/chains'

import { Currency } from '../model/currency'

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
  },
}
