import { Chain as WagmiChain } from 'wagmi'

export type Chain = WagmiChain & {
  defaultGasPrice?: bigint
  icon?: string
}

export const toWagmiChain = (chain: Chain): WagmiChain => {
  return {
    id: chain.id,
    name: chain.name,
    network: chain.network,
    nativeCurrency: chain.nativeCurrency,
    rpcUrls: chain.rpcUrls,
    blockExplorers: chain.blockExplorers,
    contracts: chain.contracts,
  }
}