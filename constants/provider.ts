import { mainnet } from '@starknet-react/chains'
import { RpcBatchProvider } from '@argent/x-multicall'

export const PROVIDER: {
  [network: string]: RpcBatchProvider
} = {
  [mainnet.network]: new RpcBatchProvider({
    nodeUrl:
      'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/3Um4IcT1mrq2MEOYurXvsRAzk_v3Q_4X',
    maxBatchSize: 100,
  }),
}
