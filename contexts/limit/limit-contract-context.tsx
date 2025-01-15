import React, { useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { parseUnits } from 'viem'
import { useContract, useSendTransaction } from '@starknet-react/core'

import { Currency } from '../../model/currency'
import { Market } from '../../model/market'
import { OpenOrder } from '../../model/open-order'
import { isAddressEqual } from '../../utils/address'
import { useTransactionContext } from '../transaction-context'
import { CONTRACT_ADDRESSES } from '../../constants/contract-addresses'
import { useCurrencyContext } from '../currency-context'
import { ETH_ADDRESS } from '../../constants/currency'
import { useChainContext } from '../chain-context'
import { CONTROLLER_ABI } from '../../abis/controller-abi'
import { MAKER_DEFAULT_POLICY, TAKER_DEFAULT_POLICY } from '../../constants/fee'

type LimitContractContext = {
  limit: (
    inputCurrency: Currency,
    outputCurrency: Currency,
    amount: string,
    price: string,
    postOnly: boolean,
    selectedMarket: Market,
  ) => Promise<void>
  cancels: (openOrders: OpenOrder[]) => Promise<void>
  claims: (openOrders: OpenOrder[]) => Promise<void>
}

const Context = React.createContext<LimitContractContext>({
  limit: () => Promise.resolve(),
  cancels: () => Promise.resolve(),
  claims: () => Promise.resolve(),
})

export const LimitContractProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const queryClient = useQueryClient()
  const { setConfirmation } = useTransactionContext()
  const { selectedChain } = useChainContext()
  const sendTransaction = useSendTransaction
  const { isOpenOrderApproved, allowances } = useCurrencyContext()

  const { contract: controller } = useContract({
    abi: CONTROLLER_ABI,
    address: CONTRACT_ADDRESSES[selectedChain.network].Controller,
  })

  const limit = useCallback(
    async (
      inputCurrency: Currency,
      outputCurrency: Currency,
      amount: string,
      price: string,
      postOnly: boolean,
      selectedMarket: Market,
    ) => {
      try {
        const isBid = isAddressEqual(
          selectedMarket.quote.address,
          inputCurrency.address,
        )

        if (
          (isBid && !selectedMarket.bidBook.isOpened) ||
          (!isBid && !selectedMarket.askBook.isOpened)
        ) {
          setConfirmation({
            title: `Checking Book Availability`,
            body: '',
            fields: [],
          })
          const unitSize = BigInt(
            isBid
              ? selectedMarket.bidBook.unitSize
              : selectedMarket.askBook.unitSize,
          )

          const { send, error } = sendTransaction({
            calls: controller
              ? [
                  controller.populate('open', [
                    {
                      base: outputCurrency.address as string,
                      quote: inputCurrency.address as string,
                      hooks:
                        '0x0000000000000000000000000000000000000000000000000000000000000000' as string,
                      unit_size: Number(unitSize),
                      maker_policy: {
                        uses_quote:
                          MAKER_DEFAULT_POLICY[selectedChain.network].usesQuote,
                        rate: MAKER_DEFAULT_POLICY[selectedChain.network].rate,
                      },
                      taker_policy: {
                        uses_quote:
                          TAKER_DEFAULT_POLICY[selectedChain.network].usesQuote,
                        rate: TAKER_DEFAULT_POLICY[selectedChain.network].rate,
                      },
                    },
                    ['0'],
                    2n ** 256n - 1n,
                  ]),
                ]
              : undefined,
          })

          console.log('aaaa', send, error)
        }

        setConfirmation({
          title: `Place Order`,
          body: 'Please confirm in your wallet.',
          fields: [],
        })

        const spender = CONTRACT_ADDRESSES[selectedChain.network].Controller
        if (
          !isAddressEqual(
            inputCurrency.address,
            ETH_ADDRESS[selectedChain.network],
          ) &&
          allowances[spender][inputCurrency.address] <
            parseUnits(amount, inputCurrency.decimals)
        ) {
          setConfirmation({
            title: 'Approve',
            body: 'Please confirm in your wallet.',
            fields: [],
          })
          // await maxApprove(walletClient, inputCurrency, spender)
        }
        // const args = {
        //   chainId: selectedChain.id,
        //   userAddress: walletClient.account.address,
        //   inputToken: inputCurrency.address,
        //   outputToken: outputCurrency.address,
        //   amount: amount,
        //   price: price,
        //   options: {
        //     postOnly,
        //     roundingDownTakenBid: true,
        //     roundingDownMakeAsk: true,
        //   },
        // }
        // const { transaction, result } = await limitOrder(args)
        // console.log('limitOrder request: ', args)
        // console.log('limitOrder result: ', result)

        // await sendTransaction(walletClient, transaction)
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
    },
    [allowances, queryClient, setConfirmation],
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cancels = useCallback(async (_openOrders: OpenOrder[]) => {}, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const claims = useCallback(async (_openOrders: OpenOrder[]) => {}, [])

  return (
    <Context.Provider value={{ limit, cancels, claims }}>
      {children}
    </Context.Provider>
  )
}

export const useLimitContractContext = () =>
  React.useContext(Context) as LimitContractContext
