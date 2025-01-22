import { Currency } from '../currency'
import { fetchApi } from '../../apis/utils'
import { Prices } from '../prices'

import { Aggregator } from './index'

export class AvnuAggregator implements Aggregator {
  public readonly name = 'Avnu'
  public readonly baseUrl = 'https://starknet.impulse.avnu.fi'
  public readonly contract: `0x${string}`

  private latestState:
    | {
        pathId: string
        amountIn: bigint
      }
    | undefined = undefined

  constructor(contract: `0x${string}`) {
    this.contract = contract
  }

  public async currencies(): Promise<Currency[]> {
    const result = await fetchApi<
      {
        name: string
        symbol: string
        decimals: number
        address: string
      }[]
    >(this.baseUrl, `v1/tokens`)
    return result.map(
      (currency) =>
        ({
          address: currency.address,
          name: currency.name,
          symbol: currency.symbol,
          decimals: currency.decimals,
        }) as Currency,
    )
  }

  public async prices(): Promise<Prices> {
    const result = await fetchApi<
      {
        name: string
        symbol: string
        decimals: number
        address: string
        market: { currentPrice: number }
      }[]
    >(this.baseUrl, `v1/tokens`)
    return result.reduce((acc, currency) => {
      acc[currency.address as `0x${string}`] = currency.market.currentPrice
      return acc
    }, {} as Prices)
  }

  public async quote(
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    slippageLimitPercent: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gasPrice: bigint,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userAddress?: `0x${string}`,
  ): Promise<{
    amountOut: bigint
    gasLimit: bigint
    aggregator: Aggregator
  }> {
    this.latestState = undefined
    console.log(
      'Fetching quote...',
      inputCurrency.symbol,
      outputCurrency.symbol,
      amountIn,
    )
    // const result: {
    //   outAmounts: string[]
    //   pathViz: PathViz
    //   pathId: string
    //   gasEstimate: number
    // } = await fetchApi(this.baseUrl, 'sor/quote/v2', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     accept: 'application/json',
    //   },
    //   data: {
    //     chainId: this.chain.id,
    //     inputTokens: [
    //       {
    //         tokenAddress: getAddress(inputCurrency.address),
    //         amount: amountIn.toString(),
    //       },
    //     ],
    //     outputTokens: [
    //       {
    //         tokenAddress: getAddress(outputCurrency.address),
    //         proportion: 1,
    //       },
    //     ],
    //     gasPrice: Number(gasPrice) / 1000000000,
    //     userAddr: userAddress,
    //     slippageLimitPercent,
    //     sourceBlacklist: [],
    //     pathViz: true,
    //     referralCode: '1939997089',
    //   },
    // })
    // this.latestState = { pathId: result.pathId, amountIn }
    // return {
    //   amountOut: BigInt(result.outAmounts[0]),
    //   gasLimit: BigInt(result.gasEstimate),
    //   pathViz: result.pathViz,
    //   aggregator: this,
    // }
    return {
      amountOut: 0n,
      gasLimit: 0n,
      aggregator: this,
    }
  }

  public async buildCallData(
    inputCurrency: Currency,
    amountIn: bigint,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    outputCurrency: Currency,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    slippageLimitPercent: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    gasPrice: bigint,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userAddress?: `0x${string}`,
  ): Promise<{
    data: `0x${string}`
    gas: bigint
    value: bigint
    to: `0x${string}`
    nonce?: number
    gasPrice?: bigint
  }> {
    if (
      !this.latestState ||
      (this.latestState && (this.latestState?.amountIn ?? 0n) !== amountIn)
    ) {
      // this.latestState = { pathId, amountIn }
    }
    if (!this.latestState) {
      throw new Error('Path ID is not defined')
    }
    console.log('Assembling transaction...', this.latestState)
    return {
      data: '0x',
      gas: 0n,
      value: 0n,
      to: '0x0000000000000000000000000000000000000000000000000000000000000000',
      nonce: 0,
      gasPrice: 0n,
    }
  }
}
