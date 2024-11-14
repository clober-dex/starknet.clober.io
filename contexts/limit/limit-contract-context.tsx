import React, { useCallback } from 'react'

import { Currency } from '../../model/currency'
import { Market } from '../../model/market'
import { OpenOrder } from '../../model/open-order'

type LimitContractContext = {
  limit: (
    inputCurrency: Currency,
    outputCurrency: Currency,
    amount: string,
    price: string,
    postOnly: boolean,
    selectedMarket: Market,
  ) => Promise<void>
  cancels: (openOrders: OpenOrder[]) => Promise<void>
  claims: (openOrders: OpenOrder[]) => Promise<void>
}

const Context = React.createContext<LimitContractContext>({
  limit: () => Promise.resolve(),
  cancels: () => Promise.resolve(),
  claims: () => Promise.resolve(),
})

export const LimitContractProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const limit = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _inputCurrency: Currency,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _outputCurrency: Currency,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _amount: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _price: string,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _postOnly: boolean,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _selectedMarket: Market,
    ) => {},
    [],
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cancels = useCallback(async (_openOrders: OpenOrder[]) => {}, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const claims = useCallback(async (_openOrders: OpenOrder[]) => {}, [])

  return (
    <Context.Provider value={{ limit, cancels, claims }}>
      {children}
    </Context.Provider>
  )
}

export const useLimitContractContext = () =>
  React.useContext(Context) as LimitContractContext
