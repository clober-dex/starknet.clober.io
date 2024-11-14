import { Chain } from '@starknet-react/chains'

import { Currency } from '../currency'
import { Prices } from '../prices'

export interface Aggregator {
  baseUrl: string
  contract: `0x${string}`
  chain: Chain
  currencies(): Promise<Currency[]>
  prices(): Promise<Prices>

  quote(
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
    ...args: any[]
  ): Promise<{
    amountOut: bigint
    gasLimit: bigint
    aggregator: Aggregator
  }>

  buildCallData(
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
    ...args: any[]
  ): Promise<{
    data: `0x${string}`
    gas: bigint
    value: bigint
    to: `0x${string}`
    nonce?: number
    gasPrice?: bigint
  }>
}
