import { getAddress } from '@starknet-react/core'

import { Aggregator } from '../model/aggregator'
import { Prices } from '../model/prices'

export async function fetchPrices(aggregators: Aggregator[]): Promise<Prices> {
  const prices = await Promise.all(
    aggregators.map((aggregator) => aggregator.prices()),
  )
  return prices.reduce((acc, prices) => {
    Object.entries(prices).forEach(([address, price]) => {
      acc[getAddress(address)] = price
    })
    return acc
  }, {} as Prices)
}
