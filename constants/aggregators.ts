import { sepolia } from '@starknet-react/chains'

import { Aggregator } from '../model/aggregator'

export const AGGREGATORS: {
  [network: string]: Aggregator[]
} = {
  [sepolia.network]: [] as Aggregator[],
}
