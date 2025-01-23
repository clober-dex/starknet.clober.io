import { sepolia } from '@starknet-react/chains'

export const CONTRACT_ADDRESSES: {
  [network: string]: {
    Controller: `0x${string}`
    BookManager: `0x${string}`
    BookViewer: `0x${string}`
  }
} = {
  [sepolia.network]: {
    Controller:
      '0x03f46d6d5adc927bbf98df941c6060c82c57e35ce052f662304a6b3b1e719cda',
    BookManager:
      '0x07743ac6334090bb75ffbf924cdff64ede7c9b8fc8ec81051f7c3a427da5f805',
    BookViewer:
      '0x0705444ec68b41814ec4529d671b3923d157bc28101776360a5bee100f3223de',
  },
}
