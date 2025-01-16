import { Currency } from '../model/currency'
import { calculateUnitSize } from '../utils/unit-size'
import { toBookId } from '../utils/book-id'
import { Book } from '../model/book'
import { multiCall } from '../utils/multi-call'
import { CONTRACT_ADDRESSES } from '../constants/contract-addresses'
import { decodeI32 } from '../utils/number'

import { fetchIsMarketOpened } from './market'

export const fetchBook = async (
  chainNetwork: string,
  quoteCurrency: Currency,
  baseCurrency: Currency,
  n: number,
) => {
  const unitSize = await calculateUnitSize(chainNetwork, quoteCurrency)
  const bookId = toBookId(
    chainNetwork,
    quoteCurrency.address,
    baseCurrency.address,
    unitSize,
  )

  const [depths, isOpened] = await Promise.all([
    multiCall<string>(chainNetwork, [
      {
        contractAddress: CONTRACT_ADDRESSES[chainNetwork].BookViewer,
        entrypoint: 'get_liquidity',
        calldata: [bookId, Number(2n ** 19n - 1n), BigInt(n)],
      },
    ]),
    fetchIsMarketOpened(chainNetwork, bookId),
  ])
  const length = Number(depths[0][0])
  return new Book({
    network: chainNetwork,
    id: bookId,
    base: baseCurrency,
    quote: quoteCurrency,
    unitSize,
    depths: Array.from({ length }, (_, i) => ({
      tick: decodeI32(BigInt(depths[0][i * 2 + 1])),
      unitAmount: BigInt(depths[0][i * 2 + 2]),
    })),
    isOpened,
  })
}
