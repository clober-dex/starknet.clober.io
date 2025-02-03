import React, { useState } from 'react'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { mainnet } from '@starknet-react/chains'

import { Market } from '../model/market'

const TVChartContainer = dynamic(
  () => import('./tv-chart-container').then((mod) => mod.TvChartContainer),
  { ssr: false },
)

export const ChartContainer = ({
  selectedMarket,
  setShowOrderBook,
}: {
  selectedMarket: Market
  setShowOrderBook: (showOrderBook: boolean) => void
}) => {
  const [isScriptReady, setIsScriptReady] = useState(false)

  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true)
        }}
      />
      {isScriptReady ? (
        <TVChartContainer
          chainNetwork={mainnet.network}
          market={selectedMarket}
          setShowOrderBook={setShowOrderBook}
        />
      ) : (
        <></>
      )}
    </>
  )
}
