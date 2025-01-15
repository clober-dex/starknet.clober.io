import { Currency } from '../model/currency'
import { calculateUnitSize } from '../utils/unit-size'
import { toBookId } from '../utils/book-id'
import { Book } from '../model/book'

import { fetchIsMarketOpened } from './market'

export const fetchBook = async (
  chainNetwork: string,
  quoteCurrency: Currency,
  baseCurrency: Currency,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  n: number, // todo
) => {
  const unitSize = await calculateUnitSize(chainNetwork, quoteCurrency)
  const bookId = toBookId(
    chainNetwork,
    quoteCurrency.address,
    baseCurrency.address,
    unitSize,
  )

  const [depths, isOpened] = await Promise.all([
    Promise.resolve([] as { tick: number; depth: bigint }[]), // TODO: fetch depths
    fetchIsMarketOpened(chainNetwork, bookId),
  ])

  return new Book({
    network: chainNetwork,
    id: bookId,
    base: baseCurrency,
    quote: quoteCurrency,
    unitSize,
    depths: depths.map(({ tick, depth }: { tick: number; depth: bigint }) => ({
      tick: BigInt(tick),
      unitAmount: depth,
    })),
    isOpened,
  })
}
