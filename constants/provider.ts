import { mainnet } from '@starknet-react/chains'
import { RpcBatchProvider } from '@argent/x-multicall'

export const PROVIDER: {
  [network: string]: RpcBatchProvider
} = {
  [mainnet.network]: new RpcBatchProvider({
    nodeUrl:
      'https://starknet.blockpi.network/v1/rpc/ae9f55e5b26decb8e3b44a18a1657f0776f60026',
    maxBatchSize: 100,
  }),
}
