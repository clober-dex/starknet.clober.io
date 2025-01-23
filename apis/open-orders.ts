import { OpenOrder } from '../model/open-order'
import { multiCall } from '../utils/multi-call'
import { CONTRACT_ADDRESSES } from '../constants/contract-addresses'
import { getQuoteToken } from '../utils/token'
import { Currency } from '../model/currency'
import { decodeString } from '../utils/string'
import { isAddressEqual } from '../utils/address'
import { formatPrice } from '../utils/prices'
import { invertTick, toPrice } from '../utils/tick'
import { formatUnits } from '../utils/bigint'

const fromOrderId = (
  orderId: bigint,
): {
  bookId: bigint
  tick: bigint
  index: bigint
} => {
  const tick = (orderId >> 40n) & (2n ** 24n - 1n)
  return {
    bookId: orderId >> 64n,
    tick: tick & (2n ** 23n) ? -(2n ** 24n - tick) : tick,
    index: orderId & (2n ** 40n - 1n),
  }
}

export async function fetchOpenOrdersByUserAddress(
  chainNetwork: string,
  userAddress: `0x${string}`,
): Promise<OpenOrder[]> {
  const openOrders = await multiCall<string[]>(chainNetwork, [
    {
      contractAddress: CONTRACT_ADDRESSES[chainNetwork]!.BookManager,
      entrypoint: 'all_orders_of_owner',
      calldata: [userAddress],
    },
  ])
  const length = Number(openOrders?.[0]?.[0] ?? 0)
  const bookIds = Array.from({ length }, (_, index) => {
    const id = openOrders[0][index * 6 + 1]
    return fromOrderId(BigInt(id)).bookId
  })
  const bookKeys: {
    [bookId: string]: { base: string; quote: string; unitSize: bigint }
  } = (
    await multiCall<string[]>(
      chainNetwork,
      bookIds.map((bookId) => ({
        contractAddress: CONTRACT_ADDRESSES[chainNetwork]!.BookManager,
        entrypoint: 'get_book_key',
        calldata: [bookId],
      })),
    )
  ).reduce(
    (acc, result, index) => {
      const bookId = bookIds[index]
      acc[bookId.toString()] = {
        base: result[0],
        quote: result[1],
        unitSize: BigInt(result[3]),
      }
      return acc
    },
    {} as {
      [bookId: string]: { base: string; quote: string; unitSize: bigint }
    },
  )
  const uniqueTokenAddresses = Array.from(
    new Set(Object.values(bookKeys).flatMap((keys) => [keys.base, keys.quote])),
  )
  const currencies = await multiCall<string[]>(
    chainNetwork,
    uniqueTokenAddresses
      .map((address) => [
        { contractAddress: address as `0x${string}`, entrypoint: 'name' },
        { contractAddress: address as `0x${string}`, entrypoint: 'symbol' },
        { contractAddress: address as `0x${string}`, entrypoint: 'decimals' },
      ])
      .flat(),
  )
  const currencyMap = uniqueTokenAddresses.reduce(
    (acc, address, index) => {
      acc[address as `0x${string}`] = {
        address: address as `0x${string}`,
        name: decodeString(currencies[index * 3]),
        symbol: decodeString(currencies[index * 3 + 1]),
        decimals: Number(currencies[index * 3 + 2][0]),
      }
      return acc
    },
    {} as { [address: string]: Currency },
  )

  return Array.from({ length }, (_, index) => {
    const id = openOrders[0][index * 6 + 1]
    const open = BigInt(openOrders[0][index * 6 + 3])
    const claimable = BigInt(openOrders[0][index * 6 + 4])
    const initial = BigInt(openOrders[0][index * 6 + 5])
    const unitSize =
      bookKeys[fromOrderId(BigInt(id)).bookId.toString()].unitSize
    const { bookId, tick, index: orderIndex } = fromOrderId(BigInt(id))
    const quote = getQuoteToken({
      chainNetwork,
      token0: bookKeys[bookId.toString()].quote as `0x${string}`,
      token1: bookKeys[bookId.toString()].base as `0x${string}`,
    })
    const isBid = isAddressEqual(
      quote,
      bookKeys[bookId.toString()].quote as `0x${string}`,
    )
    const quoteCurrency = isBid
      ? currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`]
      : currencyMap[bookKeys[bookId.toString()].base as `0x${string}`]
    const baseCurrency = isBid
      ? currencyMap[bookKeys[bookId.toString()].base as `0x${string}`]
      : currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`]
    const price = formatPrice(
      isBid ? toPrice(tick) : toPrice(invertTick(tick)),
      quoteCurrency.decimals,
      baseCurrency.decimals,
    )
    return {
      id,
      user: userAddress,
      isBid,
      inputCurrency:
        currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`],
      outputCurrency:
        currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`],
      price,
      tick: Number(tick),
      orderIndex: orderIndex.toString(),
      //
      cancelable: {
        currency:
          currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`],
        value: formatUnits(
          open * unitSize,
          currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`]
            .decimals,
        ),
      },
      amount: {
        currency:
          currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`],
        value: formatUnits(
          initial * unitSize,
          currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`]
            .decimals,
        ),
      },
      filled: {
        currency:
          currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`],
        value: formatUnits(
          (initial - open) * unitSize,
          currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`]
            .decimals,
        ),
      },
      //
      claimable: {
        currency:
          currencyMap[bookKeys[bookId.toString()].base as `0x${string}`],
        value: (
          Number(
            formatUnits(
              claimable * unitSize,
              currencyMap[bookKeys[bookId.toString()].quote as `0x${string}`]
                .decimals,
            ),
          ) * (isBid ? 1 / Number(price) : Number(price))
        ).toString(),
      },
    } as OpenOrder
  })
}
