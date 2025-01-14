import { expect, test } from 'bun:test'
import { RpcProvider } from 'starknet'
import { sepolia } from '@starknet-react/chains'

import { toBookId } from '../utils/book-id'

const provider = new RpcProvider({
  nodeUrl: 'https://starknet-sepolia.public.blastapi.io/',
})

test('encodeBookKey', async () => {
  const results = await provider.callContract({
    contractAddress:
      '0x000d4e7c34e4fb4389c394b401c20882e15485f178ed668722da21e6aac51c4a',
    entrypoint: 'encode_book_key',
    calldata: [
      {
        base: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        quote:
          '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
        hooks:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        unit_size: 1n,
        maker_policy: { uses_quote: true, rate: 0n },
        taker_policy: { uses_quote: true, rate: 100n },
      },
    ],
  })

  expect(BigInt(results[0])).toBe(
    toBookId(
      sepolia.network,
      '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d',
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
      1n,
    ),
  )
})
