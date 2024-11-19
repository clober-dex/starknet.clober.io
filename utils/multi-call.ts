import { PROVIDER } from '../constants/provider'

export const multiCall = async <T>(
  network: string,
  calls: {
    contractAddress: `0x${string}`
    entrypoint: string
    calldata?: any[]
  }[],
): Promise<T[]> => {
  const results = await Promise.allSettled(
    calls.map(({ contractAddress, entrypoint, calldata }) =>
      PROVIDER[network].callContract({
        contractAddress,
        entrypoint,
        calldata,
      }),
    ),
  ).then((results) =>
    results.map((result) => {
      if (result.status === 'fulfilled' && result.value !== undefined) {
        return result.value
      } else {
        return null
      }
    }),
  )
  return results.filter((result) => result !== null) as T[]
}
