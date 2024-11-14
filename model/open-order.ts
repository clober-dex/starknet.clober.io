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
  txHash: `0x${string}`
  createdAt: number
  amount: {
    currency: Currency
    value: string
  }
  filled: {
    currency: Currency
    value: string
  }
  claimed: {
    currency: Currency
    value: string
  }
}
