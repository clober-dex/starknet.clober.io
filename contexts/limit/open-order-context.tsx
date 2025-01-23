import React from 'react'
import { useAccount } from '@starknet-react/core'
import { useQuery } from '@tanstack/react-query'

import { useChainContext } from '../chain-context'
import { OpenOrder } from '../../model/open-order'
import { fetchOpenOrdersByUserAddress } from '../../apis/open-orders'

type OpenOrderContext = {
  openOrders: OpenOrder[]
}

const Context = React.createContext<OpenOrderContext>({
  openOrders: [],
})

export const OpenOrderProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const { address: userAddress } = useAccount()
  const { selectedChain } = useChainContext()

  const { data: openOrders } = useQuery({
    queryKey: ['open-orders', selectedChain.network, userAddress],
    queryFn: () =>
      userAddress
        ? fetchOpenOrdersByUserAddress(selectedChain.network, userAddress)
        : [],
    refetchIntervalInBackground: true,
    refetchInterval: 2 * 1000,
    initialData: [],
  })

  return (
    <Context.Provider
      value={{
        openOrders: openOrders ?? [],
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useOpenOrderContext = () =>
  React.useContext(Context) as OpenOrderContext
