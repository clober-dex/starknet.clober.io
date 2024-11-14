import { Currency } from './currency'
import { Depth } from './depth'

export type Market = {
  network: string
  quote: Currency
  base: Currency
  makerFee: number
  takerFee: number
  bids: Depth[]
  bidBook: Book
  asks: Depth[]
  askBook: Book
}

type Book = {
  id: string
  base: Currency
  unitSize: string
  quote: Currency
  isOpened: boolean
}
