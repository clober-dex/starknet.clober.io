import { poseidonHashMany } from '@scure/starknet'

import { MAKER_DEFAULT_POLICY, TAKER_DEFAULT_POLICY } from '../constants/fee'

export const toBookId = (
  chainNetwork: string,
  quote: `0x${string}`,
  base: `0x${string}`,
  unitSize: bigint,
) => {
  const struct = {
    base: BigInt(base),
    quote: BigInt(quote),
    unit_size: unitSize,
    maker_policy: {
      uses_quote: MAKER_DEFAULT_POLICY[chainNetwork].usesQuote,
      rate: MAKER_DEFAULT_POLICY[chainNetwork].rate,
    },
    taker_policy: {
      uses_quote: TAKER_DEFAULT_POLICY[chainNetwork].usesQuote,
      rate: TAKER_DEFAULT_POLICY[chainNetwork].rate,
    },
  }

  const structArray = [
    struct.base,
    struct.quote,
    0n,
    struct.unit_size,
    BigInt(struct.maker_policy.uses_quote ? 1 : 0),
    BigInt(struct.maker_policy.rate),
    BigInt(struct.taker_policy.uses_quote ? 1 : 0),
    BigInt(struct.taker_policy.rate),
  ]

  return (
    poseidonHashMany(structArray) &
    BigInt('0x7ffffffffffffffffffffffffffffffffffffffffffffff')
  )
}
