import { sepolia } from '@starknet-react/chains'

export const CONTRACT_ADDRESSES: {
  [network: string]: { Controller: `0x${string}`; BookManager: `0x${string}` }
} = {
  [sepolia.network]: {
    Controller:
      '0x0621ea4e9376a3639191877e0aa11b58938fb609a145ecd7020f3ac39ea9642e',
    BookManager:
      '0x000d4e7c34e4fb4389c394b401c20882e15485f178ed668722da21e6aac51c4a',
  },
}
