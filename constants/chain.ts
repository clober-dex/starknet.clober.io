import { Chain, mainnet } from '@starknet-react/chains'

export const DEFAULT_CHAIN_NETWORK = mainnet.network

export const supportChains: Chain[] = [mainnet]

export const testnetChainNetworks: string[] = [mainnet.network]

export const findSupportChain = (chainNetwork: string): Chain | undefined =>
  supportChains.find((chain) => chain.network === chainNetwork)
