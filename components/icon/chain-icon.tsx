import React from 'react'
import Image from 'next/image'
import { Chain } from '@starknet-react/chains'

export default function ChainIcon({
  chain,
  ...props
}: React.BaseHTMLAttributes<HTMLDivElement> & {
  chain: Chain
}) {
  // const name = chain.name.toLowerCase().split(' ')[0]
  // TODO
  return (
    <div {...props}>
      <Image alt="ChainIcon" width={16} height={16} />
    </div>
  )
}
