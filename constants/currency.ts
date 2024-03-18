import { zeroAddress } from 'viem'

import { CHAIN_IDS } from './chain'

export const WETH_ADDRESSES: {
  [chain in CHAIN_IDS]: `0x${string}`[]
} = {
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: [zeroAddress],
  [CHAIN_IDS.BERA_CHAIN_TESTNET]: [zeroAddress], // todo
}

export const STABLE_COIN_ADDRESSES: {
  [chain in CHAIN_IDS]: `0x${string}`[]
} = {
  [CHAIN_IDS.ARBITRUM_SEPOLIA]: ['0x00BFD44e79FB7f6dd5887A9426c8EF85A0CD23e0'],
  [CHAIN_IDS.BERA_CHAIN_TESTNET]: [zeroAddress], // todo
}