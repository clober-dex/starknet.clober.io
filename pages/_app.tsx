import React, { useEffect } from 'react'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { configureChains, createConfig, useAccount, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { identify } from '@web3analytic/funnel-sdk'
import { mainnet, arbitrum } from '@wagmi/chains'
import dynamic from 'next/dynamic'

import Header from '../components/header'
import Footer from '../components/footer'
import { ChainProvider } from '../contexts/chain-context'

export const {
  chains: chainList,
  publicClient,
  webSocketPublicClient,
} = configureChains(
  [mainnet, arbitrum],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '' }),
    publicProvider(),
  ],
)

const { connectors } = getDefaultWallets({
  appName: 'Clober Dex',
  projectId: '14e09398dd595b0d1dccabf414ac4531',
  chains: chainList,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

const WalletProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chainList} theme={darkTheme()}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

const Web3AnalyticWrapper = ({ children }: React.PropsWithChildren) => {
  const { address } = useAccount()

  useEffect(() => {
    if (!address) {
      return
    }
    identify(process.env.NEXT_PUBLIC_WEB3_ANALYTIC_API_KEY || '', address)
  }, [address])

  return <>{children}</>
}

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          content="Join Clober DEX and Start Trading on a Fully On-chain Order Book. Eliminate Counterparty Risk. Place Limit Orders. Low Transaction Costs Powered by LOBSTER."
          name="description"
        />
        <link href="/favicon.svg" rel="icon" />
      </Head>
      <WalletProvider>
        <ChainProvider>
          <Web3AnalyticWrapper>
            <div className="flex flex-col w-[100vw] min-h-[100vh] bg-gray-950">
              <Header />
              <Component {...pageProps} />
              <Footer />
            </div>
          </Web3AnalyticWrapper>
        </ChainProvider>
      </WalletProvider>
    </>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
})