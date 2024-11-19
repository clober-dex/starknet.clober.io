import { sepolia } from '@starknet-react/chains'

import { FeePolicy } from '../model/fee-policy'

export const MAKER_DEFAULT_POLICY: {
  [network in string]: FeePolicy
} = {
  [sepolia.network]: new FeePolicy(true, 0n), // 0%,
}

export const TAKER_DEFAULT_POLICY: {
  [network in string]: FeePolicy
} = {
  [sepolia.network]: new FeePolicy(true, 100n), // 0.01%
}
