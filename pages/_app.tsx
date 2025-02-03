import React, { useCallback, useEffect, useState } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { mainnet } from '@starknet-react/chains'
import {
  argent,
  braavos,
  publicProvider,
  StarknetConfig,
} from '@starknet-react/core'

import HeaderContainer from '../containers/header-container'
import Footer from '../components/footer'
import { ChainProvider, useChainContext } from '../contexts/chain-context'
import { MarketProvider } from '../contexts/limit/market-context'
import { TransactionProvider } from '../contexts/transaction-context'
import { LimitProvider } from '../contexts/limit/limit-context'
import { OpenOrderProvider } from '../contexts/limit/open-order-context'
import Panel from '../components/panel'
import ErrorBoundary from '../components/error-boundary'
import { CurrencyProvider } from '../contexts/currency-context'

const WalletProvider = ({ children }: React.PropsWithChildren) => {
  const chains = [mainnet]
  const provider = publicProvider()
  const connectors = [braavos(), argent()]

  return (
    <StarknetConfig
      chains={chains}
      provider={provider}
      connectors={connectors}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  )
}

const LimitProvidersWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <OpenOrderProvider>
      <LimitProvider>
        <MarketProvider>{children}</MarketProvider>
      </LimitProvider>
    </OpenOrderProvider>
  )
}

const PanelWrapper = ({
  open,
  setOpen,
  children,
}: {
  open: boolean
  setOpen: (open: boolean) => void
} & React.PropsWithChildren) => {
  const router = useRouter()
  const { selectedChain } = useChainContext()

  return (
    <Panel
      chainNetwork={selectedChain.network}
      open={open}
      setOpen={setOpen}
      router={router}
    >
      {children}
    </Panel>
  )
}

const MainComponentWrapper = ({ children }: React.PropsWithChildren) => {
  const router = useRouter()
  const { selectedChain } = useChainContext()
  return (
    <div className="flex flex-1 relative justify-center bg-gray-950">
      <div className="flex w-full flex-col items-center gap-4 sm:gap-6 p-4 pb-0">
        <div className={`relative flex gap-4 mt-14`}>
          <button
            className="flex font-bold items-center justify-center text-base sm:text-2xl w-16 sm:w-[120px] bg-transparent text-gray-500 disabled:text-white border-0 rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent disabled:border-b-white"
            disabled={router.pathname === '/limit'}
            onClick={() => router.push(`/limit?chain=${selectedChain.network}`)}
          >
            Limit
          </button>
          <button
            className="flex font-bold items-center justify-center text-base sm:text-2xl w-16 sm:w-[120px] bg-transparent text-gray-500 border-0 rounded-none p-2 border-b-4 border-b-transparent border-t-4 border-t-transparent"
            disabled={true}
          >
            Swap
          </button>
        </div>
        {children}
      </div>
      <div className="absolute w-full h-[30%] bottom-0 bg-gradient-to-t from-blue-500 to-transparent opacity-[15%] pointer-events-none" />
    </div>
  )
}

const FooterWrapper = () => {
  return <Footer latestSubgraphBlockNumber={0} />
}

function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const router = useRouter()

  const handlePopState = useCallback(async () => {
    if (history.length > 1) {
      setHistory((previous) => previous.slice(0, previous.length - 1))
      router.push(history[history.length - 2])
    }
  }, [history, router])

  useEffect(() => {
    setHistory((previous) => [...previous, router.asPath])
  }, [router.asPath])

  useEffect(() => {
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [handlePopState])

  return (
    <>
      <ErrorBoundary>
        <Head>
          <title>Clober | Fully On-chain Order Book</title>
          <meta
            content="Join Clober DEX and Start Trading on a Fully On-chain Order Book. Eliminate Counterparty Risk. Place Limit Orders. Low Transaction Costs Powered by LOBSTER."
            name="description"
          />
          <link rel="apple-touch-icon" href="/favicon.png" />
          <link rel="icon" type="image/png" href="/favicon.png" />
        </Head>
        <WalletProvider>
          <TransactionProvider>
            <ChainProvider>
              <CurrencyProvider>
                <LimitProvidersWrapper>
                  <div className="flex flex-col w-[100vw] min-h-[100vh] bg-gray-950">
                    <PanelWrapper open={open} setOpen={setOpen} />
                    <HeaderContainer onMenuClick={() => setOpen(true)} />
                    <MainComponentWrapper>
                      <Component {...pageProps} />
                    </MainComponentWrapper>
                    <FooterWrapper />
                  </div>
                </LimitProvidersWrapper>
              </CurrencyProvider>
            </ChainProvider>
          </TransactionProvider>
        </WalletProvider>
      </ErrorBoundary>
    </>
  )
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
})
