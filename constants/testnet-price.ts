import { sepolia } from '@starknet-react/chains'

import { Prices } from '../model/prices'

export const TESTNET_PRICES: {
  [chain in string]: Prices
} = {
  [sepolia.network]: {
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 4000,
    '0x0294ac7d3d0197d637a408eaeb43a8902fa761206aa5d17cdca0ba0e062bf1f1': 1,
  } as Prices,
}
