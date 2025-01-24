import { parseUnits } from 'viem'
import React, { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getAddress,
  useContract,
  useSendTransaction,
} from '@starknet-react/core'
import { Chain } from '@starknet-react/chains'

import { OpenOrder } from '../model/open-order'
import { OpenOrderCard } from '../components/card/open-order-card'
import { toPlacesAmountString } from '../utils/bignumber'
import { useTransactionContext } from '../contexts/transaction-context'
import { useCurrencyContext } from '../contexts/currency-context'
import { CONTROLLER_ABI } from '../abis/controller-abi'
import { CONTRACT_ADDRESSES } from '../constants/contract-addresses'

const OpenOrderCardContainer = ({
  selectedChain,
  openOrder,
  setApprovalOfOpenOrdersForAll,
}: {
  selectedChain: Chain
  openOrder: OpenOrder
  setApprovalOfOpenOrdersForAll: () => Promise<any>
}) => {
  const { setConfirmation } = useTransactionContext()
  const queryClient = useQueryClient()
  const { prices, isOpenOrderApproved } = useCurrencyContext()

  const { contract: controller } = useContract({
    abi: CONTROLLER_ABI,
    address: CONTRACT_ADDRESSES[selectedChain.network].Controller,
  })

  const { sendAsync: claim } = useSendTransaction({
    calls: controller
      ? [controller.populate('claim', [openOrder.id, ['0'], 9999999999])]
      : undefined,
  })

  const { sendAsync: cancel } = useSendTransaction({
    calls: controller
      ? [controller.populate('cancel', [openOrder.id, 0n, ['0'], 9999999999])]
      : undefined,
  })

  const claims = useCallback(async () => {
    try {
      setConfirmation({
        title: `Claim Order`,
        body: 'Please confirm in your wallet.',
        fields: [
          {
            currency: openOrder.claimable.currency,
            label: openOrder.claimable.currency.symbol,
            value: toPlacesAmountString(
              openOrder.claimable.value,
              prices[getAddress(openOrder.claimable.currency.address)] ?? 0,
            ),
            direction: 'out',
          },
        ],
      })

      if (!isOpenOrderApproved) {
        await setApprovalOfOpenOrdersForAll()
      }
      await claim()
    } catch (e) {
      console.error(e)
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['balances'] }),
        queryClient.invalidateQueries({ queryKey: ['open-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['market'] }),
        queryClient.invalidateQueries({ queryKey: ['allowances'] }),
      ])
      setConfirmation(undefined)
    }
  }, [
    claim,
    isOpenOrderApproved,
    openOrder.claimable.currency,
    openOrder.claimable.value,
    prices,
    queryClient,
    setApprovalOfOpenOrdersForAll,
    setConfirmation,
  ])

  const cancels = useCallback(async () => {
    try {
      console.log('price', prices)
      setConfirmation({
        title: `Cancel Order`,
        body: 'Please confirm in your wallet.',
        fields: [
          {
            currency: openOrder.cancelable.currency,
            label: openOrder.cancelable.currency.symbol,
            value: toPlacesAmountString(
              openOrder.cancelable.value,
              prices[getAddress(openOrder.cancelable.currency.address)] ?? 0,
            ),
            direction: 'out',
          },
        ],
      })

      if (!isOpenOrderApproved) {
        await setApprovalOfOpenOrdersForAll()
      }
      await cancel()
    } catch (e) {
      console.error(e)
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['balances'] }),
        queryClient.invalidateQueries({ queryKey: ['open-orders'] }),
        queryClient.invalidateQueries({ queryKey: ['market'] }),
        queryClient.invalidateQueries({ queryKey: ['allowances'] }),
      ])
      setConfirmation(undefined)
    }
  }, [
    cancel,
    isOpenOrderApproved,
    openOrder.cancelable.currency,
    openOrder.cancelable.value,
    prices,
    queryClient,
    setApprovalOfOpenOrdersForAll,
    setConfirmation,
  ])

  return (
    <OpenOrderCard
      openOrder={openOrder}
      key={openOrder.id}
      claimActionButtonProps={{
        disabled:
          parseUnits(
            openOrder.claimable.value,
            openOrder.claimable.currency.decimals,
          ) === 0n,
        onClick: async () => {
          await claims()
        },
        text: 'Claim',
      }}
      cancelActionButtonProps={{
        disabled: !openOrder.cancelable,
        onClick: async () => {
          await cancels()
        },
        text: 'Cancel',
      }}
    />
  )
}

export default OpenOrderCardContainer
