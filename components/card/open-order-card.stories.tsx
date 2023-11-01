import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import '../../styles/globals.css'
import { dummyCurrencies } from '../../.storybook/dummy-data/currencies'

import { OpenOrderCard } from './open-order-card'

export default {
  title: 'OpenOrderCard',
  component: OpenOrderCard,
  parameters: {
    layout: 'centered',
  },
  render: ({ ...args }) => (
    <div className="flex flex-col w-[448px] h-[154px] gap-2">
      <OpenOrderCard {...args} />
    </div>
  ),
} as Meta<typeof OpenOrderCard>

type Story = StoryObj<typeof OpenOrderCard>

export const Bid: Story = {
  args: {
    openOrder: {
      inputCurrency: dummyCurrencies[0],
      outputCurrency: dummyCurrencies[1],
      isBid: true,
      txHash:
        '0x6d91975935196522e7da9911412a1c2c2e509b13f19f215f7aaef820f7125734',
      price: 1600000000000000000000n,
      filledAmount: 120000000000000000n,
      amount: 1000000000000000000n,
      claimableAmount: 700000000000000000n,
    },
  },
}

export const Ask: Story = {
  args: {
    openOrder: {
      inputCurrency: dummyCurrencies[1],
      outputCurrency: dummyCurrencies[0],
      isBid: false,
      txHash:
        '0x6d91975935196522e7da9911412a1c2c2e509b13f19f215f7aaef820f7125734',
      price: 1600000000000000000000n,
      filledAmount: 1000000000000000000n,
      amount: 1000000000000000000n,
      claimableAmount: 1000000000000000000n,
    },
  },
}

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}
