import { sepolia } from '@starknet-react/chains'
import { RpcBatchProvider } from '@argent/x-multicall'

export const PROVIDER: {
  [network: string]: RpcBatchProvider
} = {
  [sepolia.network]: new RpcBatchProvider({
    nodeUrl:
      'https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/3Um4IcT1mrq2MEOYurXvsRAzk_v3Q_4X',
    maxBatchSize: 100,
  }),
}
