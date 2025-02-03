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
      '0x06306dd0bdf85698b982dbe05904f831c79e3479ebbd7bf16cae17c9c24da5ea',
    BookManager:
      '0x04c67309350e5fd9344b9d00c5fabc8ef9133dbed348bc87620ac5f05101159d',
    BookViewer:
      '0x03d6f245d110e10d92f89487dafb13cd09580ec79e51014f286bb35e0fb29543',
  },
}
