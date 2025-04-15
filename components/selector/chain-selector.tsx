import React from 'react'
import { Chain } from '@starknet-react/chains'

import { textStyles } from '../../themes/text-styles'
import ChainIcon from '../icon/chain-icon'

export default function ChainSelector({
  chain,
  chains,
}: {
  chain: Chain
  chains: Chain[]
}) {
  return chains.find((_chain) => _chain.network === chain.network) ? (
    <div className="flex relative">
      <div className="flex items-center justify-center lg:justify-start h-8 w-8 lg:w-auto p-0 lg:px-2 lg:gap-2 rounded bg-gray-800 hover:bg-gray-700 text-white">
        <ChainIcon />
        <p className={`hidden lg:block ${textStyles.body3Bold}`}>Starknet</p>
      </div>
    </div>
  ) : (
    <></>
  )
}
