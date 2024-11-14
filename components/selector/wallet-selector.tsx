import React from 'react'
import { StarknetkitConnector, useStarknetkitConnectModal } from 'starknetkit'
import { Connector, useConnect, useDisconnect } from '@starknet-react/core'

import { UserButton } from '../button/user-button'
import { ConnectButton } from '../button/connect-button'

export function WalletSelector({
  address,
  status,
}: {
  address: `0x${string}` | undefined
  status: 'connected' | 'disconnected' | 'reconnecting' | 'connecting'
}) {
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect({})
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    dappName: 'Clober Dex',
    modalTheme: 'dark',
  })

  async function connectWalletWithModal() {
    try {
      const { connector } = await starknetkitConnectModal()
      if (!connector) {
        return
      }
      await connectAsync({ connector: connector as Connector })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex items-center">
      {status === 'disconnected' || status === 'connecting' ? (
        <ConnectButton openConnectModal={connectWalletWithModal} />
      ) : address ? (
        <UserButton address={address} disconnectFn={disconnectAsync} />
      ) : (
        <button
          disabled={true}
          className="flex items-center h-8 py-0 px-3 md:px-4 rounded bg-blue-500 hover:bg-blue-600 disabled:bg-gray-800 text-white disabled:text-green-500 text-xs sm:text-sm"
        >
          {status}
        </button>
      )}
    </div>
  )
}
