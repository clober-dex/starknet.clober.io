import { mainnet } from '@starknet-react/chains'

import { Aggregator } from '../model/aggregator'
import { AvnuAggregator } from '../model/aggregator/avnu'

export const AGGREGATORS: {
  [network: string]: Aggregator[]
} = {
  [mainnet.network]: [
    new AvnuAggregator(
      // todo
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    ),
  ] as Aggregator[],
}
