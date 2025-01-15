import React, { useCallback, useMemo, useState } from 'react'
import { parseUnits } from 'viem'
import BigNumber from 'bignumber.js'
import {
  getAddress,
  useAccount,
  useContract,
  useSendTransaction,
} from '@starknet-react/core'
import { useQueryClient } from '@tanstack/react-query'

import { LimitForm } from '../components/form/limit-form'
import OrderBook from '../components/order-book'
import { useChainContext } from '../contexts/chain-context'
import { useMarketContext } from '../contexts/limit/market-context'
import { textStyles } from '../themes/text-styles'
import { useOpenOrderContext } from '../contexts/limit/open-order-context'
import { useLimitContext } from '../contexts/limit/limit-context'
import { ActionButton } from '../components/button/action-button'
import { OpenOrderCard } from '../components/card/open-order-card'
import { useCurrencyContext } from '../contexts/currency-context'
import { isAddressEqual, isAddressesEqual } from '../utils/address'
import { fetchQuotes } from '../apis/swap/quotes'
import { formatUnits } from '../utils/bigint'
import { toPlacesAmountString, toPlacesString } from '../utils/bignumber'
import { AGGREGATORS } from '../constants/aggregators'
import { getQuoteToken } from '../utils/token'
import { CONTROLLER_ABI } from '../abis/controller-abi'
import { CONTRACT_ADDRESSES } from '../constants/contract-addresses'
import { MAKER_DEFAULT_POLICY, TAKER_DEFAULT_POLICY } from '../constants/fee'
import {
  Confirmation,
  useTransactionContext,
} from '../contexts/transaction-context'
import { Market } from '../model/market'
import { Currency } from '../model/currency'
import { fetchMarket } from '../apis/market'
import { formatPrice, parsePrice } from '../utils/prices'
import { invertTick, toPrice } from '../utils/tick'
import { ERC20_ABI } from '../abis/arc20-abi'

import { ChartContainer } from './chart-container'

export const LimitContainer = () => {
  const { selectedChain } = useChainContext()
  const {
    selectedMarket,
    availableDecimalPlacesGroups,
    selectedDecimalPlaces,
    setSelectedDecimalPlaces,
    bids,
    asks,
    setDepthClickedIndex,
  } = useMarketContext()
  const queryClient = useQueryClient()
  const { openOrders } = useOpenOrderContext()
  const { address: userAddress } = useAccount()
  const {
    isBid,
    setIsBid,
    showInputCurrencySelect,
    setShowInputCurrencySelect,
    inputCurrency,
    setInputCurrency,
    inputCurrencyAmount,
    setInputCurrencyAmount,
    showOutputCurrencySelect,
    setShowOutputCurrencySelect,
    outputCurrency,
    setOutputCurrency,
    outputCurrencyAmount,
    setOutputCurrencyAmount,
    isPostOnly,
    setIsPostOnly,
    priceInput,
    setPriceInput,
  } = useLimitContext()
  const { setConfirmation } = useTransactionContext()
  const { balances, prices, currencies, setCurrencies, allowances } =
    useCurrencyContext()
  const [showOrderBook, setShowOrderBook] = useState(true)
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false)

  const [quoteCurrency, baseCurrency] = useMemo(() => {
    if (inputCurrency && outputCurrency) {
      const quote = getQuoteToken({
        chainNetwork: selectedChain.network,
        token0: inputCurrency.address,
        token1: outputCurrency.address,
      })
      return isAddressEqual(quote, inputCurrency.address)
        ? [inputCurrency, outputCurrency]
        : [outputCurrency, inputCurrency]
    } else {
      return [undefined, undefined]
    }
  }, [inputCurrency, outputCurrency, selectedChain.network])

  const amount = useMemo(
    () => parseUnits(inputCurrencyAmount, inputCurrency?.decimals ?? 18),
    [inputCurrency?.decimals, inputCurrencyAmount],
  )
  const tick = useMemo(() => {
    if (!selectedMarket || priceInput.length === 0) {
      return 0n
    }
    const { roundingDownTick } = parsePrice(
      Number(priceInput),
      selectedMarket.quote.decimals,
      selectedMarket.base.decimals,
    )
    return selectedMarket
      ? isBid
        ? roundingDownTick
        : invertTick(roundingDownTick)
      : 0n
  }, [isBid, priceInput, selectedMarket])

  const claimableOpenOrders = openOrders.filter(
    ({ claimable }) =>
      parseUnits(claimable.value, claimable.currency.decimals) > 0n,
  )
  const cancellableOpenOrders = openOrders.filter(
    ({ cancelable }) =>
      parseUnits(cancelable.value, cancelable.currency.decimals) > 0n,
  )

  const { contract: controller } = useContract({
    abi: CONTROLLER_ABI,
    address: CONTRACT_ADDRESSES[selectedChain.network].Controller,
  })

  const { contract: erc20 } = useContract({
    abi: ERC20_ABI,
    address: inputCurrency ? inputCurrency.address : undefined,
  })

  const { send: open } = useSendTransaction({
    calls:
      controller && outputCurrency && inputCurrency && selectedMarket
        ? [
            controller.populate('open', [
              {
                base: outputCurrency.address as string,
                quote: inputCurrency.address as string,
                hooks:
                  '0x0000000000000000000000000000000000000000000000000000000000000000' as string,
                unit_size: Number(
                  isBid
                    ? selectedMarket.bidBook.unitSize
                    : selectedMarket.askBook.unitSize,
                ),
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
              9999999999,
            ]),
          ]
        : undefined,
  })

  const { send: make } = useSendTransaction({
    calls:
      controller && selectedMarket && priceInput.length > 0
        ? [
            controller.populate('make', [
              selectedMarket.bidBook.id,
              tick,
              amount,
              ['0'],
              9999999999,
            ]),
          ]
        : undefined,
  })

  const { send: maxApprove } = useSendTransaction({
    calls:
      erc20 && inputCurrency
        ? [
            erc20.populate('approve', [
              CONTRACT_ADDRESSES[selectedChain.network].Controller as string,
              115792089237316195423570985008687907853269984665640564039457584007913129639935n,
            ]),
          ]
        : undefined,
  })

  const limit = useCallback(
    async (
      inputCurrency: Currency,
      outputCurrency: Currency,
      amount: bigint,
      price: string,
      postOnly: boolean,
      selectedMarket: Market,
    ) => {
      if (!inputCurrency || !outputCurrency || !selectedMarket) {
        return
      }

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
          open()
        }

        setConfirmation({
          title: `Place Order`,
          body: 'Please confirm in your wallet.',
          fields: [],
        })

        const spender = CONTRACT_ADDRESSES[selectedChain.network].Controller
        if (allowances[spender][inputCurrency.address] < amount) {
          setConfirmation({
            title: 'Approve',
            body: 'Please confirm in your wallet.',
            fields: [],
          })
          maxApprove()
        }

        const market = await fetchMarket(
          selectedChain.network,
          [inputCurrency.address, outputCurrency.address],
          100,
        )
        const { roundingDownTick } = parsePrice(
          Number(price),
          market.quote.decimals,
          market.base.decimals,
        )

        const isTakingBidSide = !isBid
        const { takenQuoteAmount, spentBaseAmount, bookId, events } =
          market.spend({
            spentBase: isTakingBidSide,
            limitTick: roundingDownTick,
            amountIn: amount,
          })
        const results = events.map(
          ({ tick, takenQuoteAmount, spentBaseAmount }) => ({
            price: formatPrice(
              toPrice(isBid ? invertTick(BigInt(tick)) : BigInt(tick)),
              market.quote.decimals,
              market.base.decimals,
            ),
            takenAmount: formatUnits(
              takenQuoteAmount,
              isBid ? market.base.decimals : market.quote.decimals,
            ),
            spentAmount: formatUnits(
              spentBaseAmount,
              isBid ? market.quote.decimals : market.base.decimals,
            ),
          }),
        )

        if (postOnly || spentBaseAmount === 0n) {
          setConfirmation({
            title: `Place Order`,
            body: 'Please confirm in your wallet.',
            fields: [
              {
                direction: 'out',
                currency: inputCurrency,
                label: inputCurrency.symbol,
                value: toPlacesAmountString(
                  inputCurrencyAmount,
                  prices[inputCurrency.address] ?? 0,
                ),
              },
            ] as Confirmation['fields'],
          })

          make()
        } else {
          console.log(
            'limit order',
            takenQuoteAmount,
            spentBaseAmount,
            bookId,
            events,
            results,
          )
        }
      } catch (e) {
        console.error(e)
      } finally {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['balances'] }),
          queryClient.invalidateQueries({
            queryKey: ['open-orders'],
          }),
          queryClient.invalidateQueries({ queryKey: ['market'] }),
          queryClient.invalidateQueries({ queryKey: ['allowances'] }),
        ])
        setConfirmation(undefined)
      }
    },
    [
      allowances,
      inputCurrencyAmount,
      make,
      maxApprove,
      open,
      prices,
      queryClient,
      selectedChain.network,
      setConfirmation,
    ],
  )

  return (
    <div className="flex flex-col w-fit mb-4 sm:mb-6">
      {selectedDecimalPlaces ? (
        <button
          className="rounded bg-blue-500 bg-opacity-20 text-blue-500 px-2 py-1 w-fit mb-3 text-xs sm:text-sm"
          onClick={() => setShowOrderBook(!showOrderBook)}
        >
          {showOrderBook ? 'View Chart' : 'View Order Book'}
        </button>
      ) : (
        <></>
      )}
      <div className="flex flex-col w-full lg:flex-row gap-4">
        {!showOrderBook && !selectedMarket ? (
          <div className="flex flex-col bg-gray-900 overflow-hidden rounded-2xl min-h-[280px] w-full md:w-[480px] lg:w-[704px]" />
        ) : (
          <></>
        )}
        {!showOrderBook && selectedMarket && selectedDecimalPlaces ? (
          <ChartContainer
            selectedMarket={selectedMarket}
            setShowOrderBook={setShowOrderBook}
          />
        ) : (
          <></>
        )}
        {showOrderBook && !quoteCurrency && !baseCurrency ? (
          <div className="flex flex-col p-4 sm:p-6 bg-gray-900 rounded-lg sm:rounded-xl gap-6 w-[360px] sm:w-[480px]" />
        ) : (
          <></>
        )}
        {showOrderBook &&
        quoteCurrency &&
        baseCurrency &&
        selectedDecimalPlaces ? (
          <OrderBook
            name={`${baseCurrency.symbol}/${quoteCurrency.symbol}`}
            bids={bids}
            asks={asks}
            availableDecimalPlacesGroups={availableDecimalPlacesGroups ?? []}
            selectedDecimalPlaces={selectedDecimalPlaces}
            setSelectedDecimalPlaces={setSelectedDecimalPlaces}
            setDepthClickedIndex={setDepthClickedIndex}
            className="flex flex-col p-4 sm:p-6 bg-gray-900 rounded-lg sm:rounded-xl gap-6 w-[360px] sm:w-[480px]"
          />
        ) : (
          <></>
        )}
        <div className="flex flex-col rounded-2xl bg-gray-900 p-6 w-[360px] sm:w-[480px] h-[391px] sm:h-[459px] md:h-[459px] lg:h-[460px]">
          <LimitForm
            chainNetwork={selectedChain.network}
            prices={prices}
            balances={balances}
            currencies={currencies}
            setCurrencies={setCurrencies}
            priceInput={priceInput}
            setPriceInput={setPriceInput}
            selectedMarket={selectedMarket}
            isBid={isBid}
            isPostOnly={isPostOnly}
            setIsPostOnly={setIsPostOnly}
            showInputCurrencySelect={showInputCurrencySelect}
            setShowInputCurrencySelect={setShowInputCurrencySelect}
            inputCurrency={inputCurrency}
            setInputCurrency={setInputCurrency}
            inputCurrencyAmount={inputCurrencyAmount}
            setInputCurrencyAmount={setInputCurrencyAmount}
            availableInputCurrencyBalance={
              inputCurrency
                ? (balances[getAddress(inputCurrency.address)] ?? 0n)
                : 0n
            }
            showOutputCurrencySelect={showOutputCurrencySelect}
            setShowOutputCurrencySelect={setShowOutputCurrencySelect}
            outputCurrency={outputCurrency}
            setOutputCurrency={setOutputCurrency}
            outputCurrencyAmount={outputCurrencyAmount}
            setOutputCurrencyAmount={setOutputCurrencyAmount}
            availableOutputCurrencyBalance={
              outputCurrency
                ? (balances[getAddress(outputCurrency.address)] ?? 0n)
                : 0n
            }
            swapInputCurrencyAndOutputCurrency={() => {
              setIsBid((prevState) => !prevState)
              setDepthClickedIndex(undefined)
              setInputCurrencyAmount(outputCurrencyAmount)

              // swap currencies
              const _inputCurrency = inputCurrency
              setInputCurrency(outputCurrency)
              setOutputCurrency(_inputCurrency)
            }}
            minimumDecimalPlaces={availableDecimalPlacesGroups?.[0]?.value}
            setMarketRateAction={{
              isLoading: isFetchingQuotes,
              action: async () => {
                if (inputCurrency && outputCurrency) {
                  setIsFetchingQuotes(true)
                  const quoteToken = getQuoteToken({
                    chainNetwork: selectedChain.network,
                    token0: inputCurrency.address,
                    token1: outputCurrency.address,
                  })
                  const [quoteCurrency, baseCurrency] = isAddressEqual(
                    quoteToken,
                    inputCurrency.address,
                  )
                    ? [inputCurrency, outputCurrency]
                    : [outputCurrency, inputCurrency]
                  const { amountOut } = await fetchQuotes(
                    AGGREGATORS[selectedChain.network],
                    baseCurrency,
                    parseUnits('1', baseCurrency.decimals),
                    quoteCurrency,
                    20,
                    0n,
                  )
                  const price = new BigNumber(
                    formatUnits(amountOut, quoteCurrency.decimals),
                  )
                  const minimumDecimalPlaces =
                    availableDecimalPlacesGroups?.[0]?.value
                  setPriceInput(
                    minimumDecimalPlaces
                      ? toPlacesString(price, minimumDecimalPlaces)
                      : price.toFixed(),
                  )
                  setIsFetchingQuotes(false)
                }
              },
            }}
            actionButtonProps={{
              disabled:
                (!userAddress ||
                  !inputCurrency ||
                  !outputCurrency ||
                  priceInput === '' ||
                  (selectedMarket &&
                    !isAddressesEqual(
                      [inputCurrency.address, outputCurrency.address],
                      [
                        selectedMarket.base.address,
                        selectedMarket.quote.address,
                      ],
                    )) ||
                  amount === 0n ||
                  amount > balances[getAddress(inputCurrency.address)]) ??
                0n,
              onClick: async () => {
                if (inputCurrency && outputCurrency && selectedMarket) {
                  await limit(
                    inputCurrency,
                    outputCurrency,
                    amount,
                    priceInput,
                    isPostOnly,
                    selectedMarket,
                  )
                }
              },

              text: !userAddress
                ? 'Connect wallet'
                : !inputCurrency
                  ? 'Select input currency'
                  : !outputCurrency
                    ? 'Select output currency'
                    : amount === 0n
                      ? 'Enter amount'
                      : amount > balances[getAddress(inputCurrency.address)]
                        ? 'Insufficient balance'
                        : `Place Order`,
            }}
          />
        </div>
      </div>
      {userAddress ? (
        <div className="flex pb-4 pt-8 px-1 sm:border-solid border-b-gray-800 border-b-[1.5px]">
          <div className="flex gap-6">
            <div
              className={`m-0 p-0 bg-transparent text-white ${textStyles.body2}`}
            >
              Open Orders
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2 ml-auto h-6">
            <ActionButton
              className="w-[64px] sm:w-[120px] flex flex-1 items-center justify-center rounded bg-gray-700 hover:bg-blue-600 text-white text-[10px] sm:text-sm disabled:bg-gray-800 disabled:text-gray-500 h-6 sm:h-7"
              disabled={claimableOpenOrders.length === 0}
              onClick={async () => {
                // await claims(claimableOpenOrders)
              }}
              text={`Claim (${claimableOpenOrders.length})`}
            />
            <ActionButton
              className="w-[64px] sm:w-[120px] flex flex-1 items-center justify-center rounded bg-gray-700 hover:bg-blue-600 text-white text-[10px] sm:text-sm disabled:bg-gray-800 disabled:text-gray-500 h-6 sm:h-7"
              disabled={cancellableOpenOrders.length === 0}
              onClick={async () => {
                // await cancels(cancellableOpenOrders)
              }}
              text={`Cancel (${cancellableOpenOrders.length})`}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex w-full justify-center mt-0 sm:mt-4">
        <div className="flex flex-col w-full lg:w-auto h-full lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
          {openOrders.map((openOrder, index) => (
            <OpenOrderCard
              openOrder={openOrder}
              key={index}
              claimActionButtonProps={{
                disabled:
                  parseUnits(
                    openOrder.claimable.value,
                    openOrder.claimable.currency.decimals,
                  ) === 0n,
                onClick: async () => {
                  // await claims([openOrder])
                },
                text: 'Claim',
              }}
              cancelActionButtonProps={{
                disabled: !openOrder.cancelable,
                onClick: async () => {
                  // await cancels([openOrder])
                },
                text: 'Cancel',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
