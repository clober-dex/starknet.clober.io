import React, { useState } from 'react'
import { useAccount, useBalance } from '@starknet-react/core'
import { useQuery } from '@tanstack/react-query'

import { Currency } from '../model/currency'
import { Prices } from '../model/prices'
import { Balances } from '../model/balances'
import { Allowances } from '../model/allowances'

import { useChainContext } from './chain-context'

type CurrencyContext = {
  whitelistCurrencies: Currency[]
  currencies: Currency[]
  setCurrencies: (currencies: Currency[]) => void
  prices: Prices
  balances: Balances
  allowances: Allowances
  isOpenOrderApproved: boolean
}

const Context = React.createContext<CurrencyContext>({
  whitelistCurrencies: [],
  currencies: [],
  setCurrencies: () => {},
  prices: {},
  balances: {},
  allowances: {},
  isOpenOrderApproved: false,
})

export const CurrencyProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const { address: userAddress } = useAccount()
  const { data: balance } = useBalance({ address: userAddress, watch: true })
  const { selectedChain } = useChainContext()
  const { data: whitelistCurrencies } = useQuery({
    queryKey: ['currencies', selectedChain.network],
    queryFn: async () => {
      return []
    },
    initialData: [],
  }) as {
    data: Currency[]
  }
  const [currencies, setCurrencies] = useState<Currency[]>([])

  const { data: balances } = useQuery({
    queryKey: [
      'balances',
      userAddress,
      balance,
      selectedChain.network,
      currencies,
    ],
    queryFn: async () => {
      return {} as Balances
    },
    refetchInterval: 5 * 1000,
    refetchIntervalInBackground: true,
  }) as {
    data: Balances
  }

  const { data: prices } = useQuery({
    queryKey: ['prices', selectedChain.network],
    queryFn: async () => {
      return {} as Prices
    },
    refetchInterval: 10 * 1000,
    refetchIntervalInBackground: true,
  })

  const { data } = useQuery({
    queryKey: ['allowances', userAddress, selectedChain.network, currencies],
    queryFn: async () => {
      return {
        allowances: {},
        isOpenOrderApproved: false,
      }
    },
    refetchInterval: 5 * 1000,
    refetchIntervalInBackground: true,
  }) as {
    data: { allowances: Allowances; isOpenOrderApproved: boolean }
  }

  return (
    <Context.Provider
      value={{
        whitelistCurrencies,
        prices: prices ?? {},
        balances: balances ?? {},
        allowances: data?.allowances ?? {},
        isOpenOrderApproved: data?.isOpenOrderApproved ?? false,
        currencies,
        setCurrencies,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useCurrencyContext = () =>
  React.useContext(Context) as CurrencyContext
