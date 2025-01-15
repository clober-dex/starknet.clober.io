import React, { useState } from 'react'
import { getAddress, useAccount, useBalance } from '@starknet-react/core'
import { useQuery } from '@tanstack/react-query'

import { Currency } from '../model/currency'
import { Prices } from '../model/prices'
import { Balances } from '../model/balances'
import { Allowances } from '../model/allowances'
import { fetchWhitelistCurrencies } from '../apis/currencies'
import { isAddressEqual } from '../utils/address'
import { multiCall } from '../utils/multi-call'
import { CONTRACT_ADDRESSES } from '../constants/contract-addresses'

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
      return fetchWhitelistCurrencies(selectedChain.network)
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
      if (!userAddress) {
        return {} as Balances
      }
      const uniqueCurrencies = currencies.filter(
        (currency, index, self) =>
          self.findIndex((c) => isAddressEqual(c.address, currency.address)) ===
          index,
      )
      const results = await multiCall<string[]>(
        selectedChain.network,
        uniqueCurrencies.map(({ address }) => ({
          contractAddress: address,
          entrypoint: 'balance_of',
          calldata: [userAddress],
        })),
      )
      return Object.fromEntries(
        results.map((result, index) => [
          uniqueCurrencies[index].address,
          BigInt(result?.[0] ?? '0'),
        ]),
      ) as Balances
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
      if (!userAddress) {
        return {
          allowances: {},
          isOpenOrderApproved: false,
        }
      }
      const spenders: `0x${string}`[] = [
        CONTRACT_ADDRESSES[selectedChain.network].Controller,
      ]
      const calls = [
        ...spenders
          .map((spender) => {
            return currencies.map((currency) => ({
              contractAddress: currency.address,
              entrypoint: 'allowance',
              calldata: [userAddress, spender],
            }))
          }, [])
          .flat(),
        {
          contractAddress:
            CONTRACT_ADDRESSES[selectedChain.network].BookManager,
          entrypoint: 'is_approved_for_all',
          calldata: [
            userAddress,
            CONTRACT_ADDRESSES[selectedChain.network].Controller,
          ],
        },
      ]
      const results = await multiCall<string[]>(selectedChain.network, calls)
      return {
        isOpenOrderApproved: !!Number(results.slice(-1)?.[0]),
        allowances: results.slice(0, -1).reduce(
          (
            acc: {
              [key in `0x${string}`]: { [key in `0x${string}`]: bigint }
            },
            result,
            i,
          ) => {
            const currency = currencies[i % currencies.length]
            const spender = getAddress(
              spenders[Math.floor(i / currencies.length)],
            )
            const resultValue = BigInt(result?.[0] ?? '0')
            return {
              ...acc,
              [spender]: {
                ...acc[spender],
                [getAddress(currency.address)]: resultValue,
              },
            }
          },
          spenders.reduce((acc, spender) => ({ ...acc, [spender]: {} }), {}),
        ),
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
