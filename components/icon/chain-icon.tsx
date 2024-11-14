import React from 'react'
import Image from 'next/image'

export default function ChainIcon({
  ...props
}: React.BaseHTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props}>
      <Image src="/starknet-logo.png" alt="ChainIcon" width={16} height={16} />
    </div>
  )
}
