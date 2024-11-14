import { Chain, sepolia } from '@starknet-react/chains'

export const DEFAULT_CHAIN_NETWORK = sepolia.network

export const supportChains: Chain[] = [sepolia]

export const testnetChainNetworks: string[] = [sepolia.network]

export const findSupportChain = (chainNetwork: string): Chain | undefined =>
  supportChains.find((chain) => chain.network === chainNetwork)
