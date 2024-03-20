import { createPublicClient, http } from 'viem'
import { arbitrumSepolia } from 'viem/chains'

import { FEE_POLICY_WRAPPER_ABI } from '../abis/mock/fee-policy-wrapper-abi'
import { encodeToFeePolicy } from '../utils/fee'

describe('FeePolicy', () => {
  const encode = async (usesQuote: boolean, rate: number) => {
    expect(
      BigInt(
        await publicClient.readContract({
          address: FEE_POLICY_WRAPPER_ADDRESS,
          abi: FEE_POLICY_WRAPPER_ABI,
          functionName: 'encode',
          args: [usesQuote, rate],
        }),
      ),
    ).toEqual(encodeToFeePolicy(usesQuote, BigInt(rate)))
  }

  const FEE_POLICY_WRAPPER_ADDRESS =
    '0x982c57388101D012846aDC4997E9b073F3bC16BD'
  const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(),
  })

  it('encode', async () => {
    await encode(true, 0)
    await encode(true, 1)
    await encode(true, 500000)
    await encode(true, -500000)
    await encode(false, 0)
    await encode(false, 1)
    await encode(false, 500000)
    await encode(false, -500000)
  }, 100000)
})
