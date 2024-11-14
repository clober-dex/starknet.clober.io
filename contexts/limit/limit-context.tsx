import React, { useCallback, useState } from 'react'

import { Currency } from '../../model/currency'

type LimitContext = {
  isBid: boolean
  setIsBid: (isBid: (prevState: boolean) => boolean) => void
  showInputCurrencySelect: boolean
  setShowInputCurrencySelect: (showInputCurrencySelect: boolean) => void
  inputCurrency: Currency | undefined
  setInputCurrency: (currency: Currency | undefined) => void
  inputCurrencyAmount: string
  setInputCurrencyAmount: (amount: string) => void
  showOutputCurrencySelect: boolean
  setShowOutputCurrencySelect: (showOutputCurrencySelect: boolean) => void
  outputCurrency: Currency | undefined
  setOutputCurrency: (currency: Currency | undefined) => void
  outputCurrencyAmount: string
  setOutputCurrencyAmount: (amount: string) => void
  isPostOnly: boolean
  setIsPostOnly: (isPostOnly: (prevState: boolean) => boolean) => void
  priceInput: string
  setPriceInput: (priceInput: string) => void
}

const Context = React.createContext<LimitContext>({
  isBid: true,
  setIsBid: () => {},
  showInputCurrencySelect: false,
  setShowInputCurrencySelect: () => {},
  inputCurrency: undefined,
  setInputCurrency: () => {},
  inputCurrencyAmount: '',
  setInputCurrencyAmount: () => {},
  showOutputCurrencySelect: false,
  setShowOutputCurrencySelect: () => {},
  outputCurrency: undefined,
  setOutputCurrency: () => {},
  outputCurrencyAmount: '',
  setOutputCurrencyAmount: () => {},
  isPostOnly: false,
  setIsPostOnly: () => {},
  priceInput: '',
  setPriceInput: () => {},
})

export const LimitProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [isBid, setIsBid] = useState(true)

  const [showInputCurrencySelect, setShowInputCurrencySelect] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputCurrency, _setInputCurrency] = useState<Currency | undefined>(
    undefined,
  )
  const [inputCurrencyAmount, setInputCurrencyAmount] = useState('')

  const [showOutputCurrencySelect, setShowOutputCurrencySelect] =
    useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [outputCurrency, _setOutputCurrency] = useState<Currency | undefined>(
    undefined,
  )
  const [outputCurrencyAmount, setOutputCurrencyAmount] = useState('')

  const [isPostOnly, setIsPostOnly] = useState(false)
  const [priceInput, setPriceInput] = useState('')

  const setInputCurrency = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (currency: Currency | undefined) => {},
    [],
  )

  const setOutputCurrency = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (currency: Currency | undefined) => {},
    [],
  )

  return (
    <Context.Provider
      value={{
        isBid,
        setIsBid,
        showInputCurrencySelect,
        setShowInputCurrencySelect,
        inputCurrency,
        setInputCurrency,
        inputCurrencyAmount,
        setInputCurrencyAmount,
        showOutputCurrencySelect,
        setShowOutputCurrencySelect,
        outputCurrency,
        setOutputCurrency,
        outputCurrencyAmount,
        setOutputCurrencyAmount,
        isPostOnly,
        setIsPostOnly,
        priceInput,
        setPriceInput,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useLimitContext = () => React.useContext(Context) as LimitContext
