import React, { useCallback } from 'react'
import { Chain } from '@starknet-react/chains'

import { DEFAULT_CHAIN_NETWORK, supportChains } from '../constants/chain'

type ChainContext = {
  selectedChain: Chain
  setSelectedChain: (chain: Chain) => void
}

const Context = React.createContext<ChainContext>({
  selectedChain: supportChains.find(
    (chain) => chain.network === DEFAULT_CHAIN_NETWORK,
  )!,
  setSelectedChain: (_) => _,
})

export const LOCAL_STORAGE_CHAIN_KEY = 'chain'

export const ChainProvider = ({ children }: React.PropsWithChildren<{}>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedChain, _setSelectedChain] = React.useState<Chain>(
    supportChains.find((chain) => chain.network === DEFAULT_CHAIN_NETWORK)!,
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setSelectedChain = useCallback((_chain: Chain) => {}, [])

  return (
    <Context.Provider value={{ selectedChain, setSelectedChain }}>
      {children}
    </Context.Provider>
  )
}

export const useChainContext = () => React.useContext(Context) as ChainContext
