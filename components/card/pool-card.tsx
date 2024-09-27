import React from 'react'
import { CHAIN_IDS } from '@clober/v2-sdk'
import { NextRouter } from 'next/router'

import { Pool } from '../../model/pool'
import { CurrencyIcon } from '../icon/currency-icon'
import { toCommaSeparated } from '../../utils/number'

export const PoolCard = ({
  chainId,
  pool,
  router,
}: {
  chainId: CHAIN_IDS
  pool: Pool
  router: NextRouter
}) => {
  return (
    <>
      <div className="hidden lg:flex w-[960px] h-16 px-5 py-4 bg-gray-800 rounded-2xl justify-start items-center gap-4">
        <div className="flex w-60 items-center gap-2">
          <div className="w-14 h-8 shrink-0 relative">
            <CurrencyIcon
              currency={pool.currency0}
              className="w-8 h-8 absolute left-0 top-0 z-[1]"
            />
            <CurrencyIcon
              currency={pool.currency1}
              className="w-8 h-8 absolute left-6 top-0"
            />
          </div>
          <div className="flex items-center text-white text-base font-bold gap-1">
            <div>{pool.currency0.symbol}</div>
            <div>-</div>
            <div>{pool.currency1.symbol}</div>
          </div>
        </div>
        <div className="w-[140px] text-white text-base font-bold">
          {pool.apy.toFixed(2)}%
        </div>
        <div className="w-[140px] text-white text-base font-bold">
          ${toCommaSeparated(pool.tvl.toFixed(0))}
        </div>
        <div className="w-[140px] text-white text-base font-bold">
          ${toCommaSeparated(pool.volume24h.toFixed(0))}
        </div>
        <button
          onClick={() => router.push(`/pools/${pool.key}?chain=${chainId}`)}
          className="flex w-[196px] h-8 px-3 py-2 bg-blue-500 rounded-lg justify-center items-center gap-1"
          rel="noreferrer"
        >
          <div className="grow shrink basis-0 opacity-90 text-center text-white text-sm font-bold">
            Add Liquidity
          </div>
        </button>
      </div>
      <div className="flex lg:hidden w-full h-[116px] p-4 bg-gray-800 rounded-xl flex-col justify-center items-start gap-4">
        <div className="flex items-center gap-2 self-stretch">
          <div className="w-10 h-6 relative">
            <CurrencyIcon
              currency={pool.currency0}
              className="w-6 h-6 absolute left-0 top-0 z-[1]"
            />
            <CurrencyIcon
              currency={pool.currency1}
              className="w-6 h-6 absolute left-[16px] top-0"
            />
          </div>
          <div className="flex gap-1 justify-start items-center">
            <div className="text-white text-base font-bold">
              {pool.currency0.symbol}
            </div>
            <div className="text-white text-base font-bold">-</div>
            <div className="text-white text-base font-bold">
              {pool.currency1.symbol}
            </div>
          </div>
          <button
            onClick={() => router.push(`/pools/${pool.key}?chain=${chainId}`)}
            className="flex ml-auto"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M12.6665 7.99984L3.33317 7.99984M12.6665 7.99984L9.99984 5.33317M12.6665 7.99984L9.99984 10.6665"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="w-full flex flex-row flex-1 h-11 justify-start items-start gap-2">
          <div className="flex w-full flex-col justify-start items-center gap-2">
            <div className="self-stretch text-gray-400 text-xs">APY</div>
            <div className="self-stretch text-white text-sm font-bold">
              {pool.apy.toFixed(2)}%
            </div>
          </div>
          <div className="flex w-full flex-col justify-start items-center gap-2">
            <div className="self-stretch text-center text-gray-400 text-xs">
              Total Liquidity
            </div>
            <div className="self-stretch text-center text-white text-sm font-bold">
              ${toCommaSeparated(pool.tvl.toFixed(0))}
            </div>
          </div>
          <div className="flex w-full flex-col justify-start items-center gap-2">
            <div className="self-stretch text-right text-gray-400 text-xs">
              24h Volume
            </div>
            <div className="self-stretch text-right text-white text-sm font-bold">
              ${toCommaSeparated(pool.volume24h.toFixed(0))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
