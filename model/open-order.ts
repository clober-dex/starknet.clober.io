import { Currency } from './currency'

type OnChainOpenOrder = {
  id: string
  user: `0x${string}`
  isBid: boolean
  inputCurrency: Currency
  outputCurrency: Currency
  price: string
  tick: number
  orderIndex: string
  claimable: {
    currency: Currency
    value: string
  }
  cancelable: {
    currency: Currency
    value: string
  }
}
export type OpenOrder = OnChainOpenOrder & {
  amount: {
    currency: Currency
    value: string
  }
  filled: {
    currency: Currency
    value: string
  }
}
