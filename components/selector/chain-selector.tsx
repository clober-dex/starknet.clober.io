import React from 'react'
import { Chain } from '@starknet-react/chains'
import Link from 'next/link'
import Image from 'next/image'

import { textStyles } from '../../themes/text-styles'
import useDropdown from '../../hooks/useDropdown'
import ChainIcon from '../icon/chain-icon'
import { TriangleDownSvg } from '../svg/triangle-down-svg'
import { testnetChainNetworks } from '../../constants/chain'

export default function ChainSelector({
  chain,
  chains,
}: {
  chain: Chain
  chains: Chain[]
}) {
  const { showDropdown, setShowDropdown } = useDropdown()

  const mainnetChains = chains.filter(
    (chain) => !testnetChainNetworks.includes(chain.network),
  )
  const testnetChains = chains.filter((chain) =>
    testnetChainNetworks.includes(chain.network),
  )

  return chains.find((_chain) => _chain.network === chain.network) ? (
    <div className="flex relative">
      <button
        onClick={() => {
          setShowDropdown((prev) => !prev)
        }}
        className="flex items-center justify-center lg:justify-start h-8 w-8 lg:w-auto p-0 lg:px-2 lg:gap-2 rounded bg-gray-800 hover:bg-gray-700 text-white"
      >
        <ChainIcon />
        <p className={`hidden lg:block ${textStyles.body3Bold}`}>
          {chain.network}
        </p>
        <TriangleDownSvg className="hidden lg:block" />
      </button>
      {showDropdown ? (
        <ChainsDropDown
          mainnetChains={mainnetChains}
          testnetChains={testnetChains}
        />
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  )
}

function ChainsDropDown({
  mainnetChains,
  testnetChains,
}: {
  mainnetChains: Chain[]
  testnetChains: Chain[]
}) {
  if (mainnetChains.length === 0 && testnetChains.length === 0) {
    return <></>
  }

  return (
    <div className="absolute right-1 md:right-[-5rem] top-10 md:top-12 z-[1500] flex flex-col w-48 bg-gray-800 border border-solid border-gray-700 rounded-xl py-3 items-start gap-4 shadow-[4px_4px_12px_12px_rgba(0,0,0,0.15)]">
      <>
        <ChainList
          title={'Mainnet'}
          chains={[
            { name: 'Base', icon: 'https://assets.odos.xyz/chains/base.png' },
          ]}
        />
        <div className="h-0 self-stretch stroke-[1px] stroke-gray-700">
          <svg>
            <line
              x1="0"
              y1="0"
              x2="158"
              y2="0"
              stroke="#374151"
              strokeWidth={1}
            />
          </svg>
        </div>
        <ChainList
          title={'Testnet'}
          chains={[
            {
              name: 'Monad Testnet',
              icon: 'https://imagedelivery.net/cBNDGgkrsEA-b_ixIp9SkQ/MON.png/public',
            },
          ]}
        />
      </>
    </div>
  )
}

function ChainList({
  title,
  chains,
}: {
  title: string
  chains: { name: string; icon: string }[]
}) {
  return (
    <div className="flex flex-col items-start gap-1 self-stretch rounded-none">
      <div
        className={`self-stretch px-4 text-gray-400 ${textStyles.body3Bold}`}
      >
        {title}
      </div>
      <div className="flex flex-col items-center justify-center self-stretch rounded-none">
        <div className="flex flex-col items-center justify-center self-stretch rounded-none">
          {chains.map((_chain) => (
            <Link
              target="_blank"
              href="https://app.clober.io"
              rel="noreferrer"
              className={`flex items-center gap-2 px-3 py-2 self-stretch cursor-pointer text-white ${textStyles.body3Bold} hover:bg-gray-600`}
              key={_chain.name}
            >
              <Image src={_chain.icon} alt="ChainIcon" width={16} height={16} />
              <span>{_chain.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
