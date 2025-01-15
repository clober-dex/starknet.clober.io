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
      '0x044473a320e6d6616d19b068d6b3cfda6f78a446490b425d7b6112cab478d623',
    BookManager:
      '0x02966d4772036c0c6e962407a7542cbb1ac970713d0758f322e00d8f86dea638',
    BookViewer:
      '0x0439ae1fe35bb886886f958b006ec16ecbd2f22bb37a01613e84f270fe785dfa',
  },
}
