import { mainnet } from '@starknet-react/chains'

export const CONTRACT_ADDRESSES: {
  [network: string]: {
    Controller: `0x${string}`
    BookManager: `0x${string}`
    BookViewer: `0x${string}`
  }
} = {
  [mainnet.network]: {
    Controller:
      '0x0279bacdcc5b719f4f892ddf5063926c9f58c90d1ec3c6ebf5c47d6dac294489',
    BookManager:
      '0x04c67309350e5fd9344b9d00c5fabc8ef9133dbed348bc87620ac5f05101159d',
    BookViewer:
      '0x03d6f245d110e10d92f89487dafb13cd09580ec79e51014f286bb35e0fb29543',
  },
}
