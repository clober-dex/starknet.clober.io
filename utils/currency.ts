import { Chain } from '@starknet-react/chains'
import { getAddress } from '@starknet-react/core'

import { findSupportChain } from '../constants/chain'
import { Currency } from '../model/currency'
import {
  DEFAULT_INPUT_CURRENCY,
  DEFAULT_OUTPUT_CURRENCY,
} from '../constants/currency'
import { fetchApi } from '../apis/utils'

import { isAddressEqual } from './address'

export const LOCAL_STORAGE_INPUT_CURRENCY_KEY = (
  context: string,
  chain: Chain,
) => `${chain.network}-inputCurrency-${context}`
export const LOCAL_STORAGE_OUTPUT_CURRENCY_KEY = (
  context: string,
  chain: Chain,
) => `${chain.network}-outputCurrency-${context}`
export const QUERY_PARAM_INPUT_CURRENCY_KEY = 'inputCurrency'
export const QUERY_PARAM_OUTPUT_CURRENCY_KEY = 'outputCurrency'

const currencyCache: {
  [key: string]: Currency[]
} = {}
const getCurrencyCacheKey = (chainNetwork: string, name: string) =>
  `${chainNetwork}-${name.toLowerCase()}`

let fetchCurrencyJobId: NodeJS.Timeout | null = null
let fetchCurrencyJobResult: Currency[] = []
let fetchCurrencyJobResultCode: number = 0

export const deduplicateCurrencies = (currencies: Currency[]) => {
  return currencies
    .sort((a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0))
    .filter(
      (currency, index, self) =>
        self.findIndex((c) => isAddressEqual(c.address, currency.address)) ===
        index,
    )
}

export const fetchCurrency = async (
  chainNetwork: string,
  address: `0x${string}`,
): Promise<Currency | undefined> => {
  return {
    address,
    name: 'test',
    symbol: 'test',
    decimals: 18,
  }
}

export const fetchCurrenciesByName = async (
  chainNetwork: string,
  name: string,
): Promise<Currency[]> => {
  if (fetchCurrencyJobId) {
    clearTimeout(fetchCurrencyJobId)
    fetchCurrencyJobId = null
  }
  const previousCode = fetchCurrencyJobResultCode
  // @ts-ignore
  fetchCurrencyJobId = setTimeout(async () => {
    fetchCurrencyJobResult = await fetchCurrencyByNameImpl(chainNetwork, name)
    fetchCurrencyJobResultCode = Math.random()
  }, 500)

  while (fetchCurrencyJobResultCode === previousCode) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  return fetchCurrencyJobResult
}

export const fetchCurrencyByNameImpl = async (
  chainNetwork: string,
  name: string,
): Promise<Currency[]> => {
  const chain = findSupportChain(chainNetwork)
  if (!chain) {
    return []
  }

  const cacheKey = getCurrencyCacheKey(chainNetwork, name)
  if (currencyCache[cacheKey] !== undefined) {
    return currencyCache[cacheKey]
  }

  try {
    const searchResult = (await fetchApi<any>(
      'https://api.dexscreener.com',
      `latest/dex/search?q=${name}`,
    )) as any
    const pairs = (searchResult.pairs ?? []) as any[]
    const candidateTokens: {
      [key: `0x${string}`]: number
    } = {}
    for (const pair of pairs) {
      const chainName = (pair.chainId as string).split('-')[0]
      if (chainName !== chain.network) {
        continue
      }

      const baseToken = pair.baseToken as any
      const quoteToken = pair.quoteToken as any
      for (const token of [baseToken, quoteToken]) {
        if (
          (token.symbol as string).toLowerCase().includes(name.toLowerCase()) ||
          (token.name as string).toLowerCase().includes(name.toLowerCase())
        ) {
          candidateTokens[token.address as `0x${string}`] =
            (candidateTokens[token.address as `0x${string}`] ?? 0) +
            (pair.volume.h24 as number)
        }
      }
    }

    const addresses = (Object.keys(candidateTokens) as `0x${string}`[]).sort(
      (a, b) => candidateTokens[b] - candidateTokens[a],
    )
    const tokens = (
      await Promise.all(
        addresses.map((address) => fetchCurrency(chainNetwork, address)),
      )
    ).filter((token) => token !== undefined) as Currency[]
    currencyCache[cacheKey] = tokens
    return tokens
  } catch (e) {
    return []
  }
}

export const isCurrencyEqual = (a: Currency, b: Currency) => {
  return (
    isAddressEqual(a.address, b.address) &&
    a.decimals === b.decimals &&
    a.name === b.name &&
    a.symbol === b.symbol
  )
}

export const fetchCurrenciesDone = (currencies: Currency[], chain: Chain) => {
  return (
    currencies.find((currency) =>
      isAddressEqual(
        currency.address,
        getAddress(DEFAULT_INPUT_CURRENCY[chain.network].address),
      ),
    ) &&
    currencies.find((currency) =>
      isAddressEqual(
        currency.address,
        getAddress(DEFAULT_OUTPUT_CURRENCY[chain.network].address),
      ),
    )
  )
}

export const getCurrencyAddress = (context: string, chain: Chain) => {
  const params = new URLSearchParams(window.location.search)
  const queryParamInputCurrencyAddress = params.get(
    QUERY_PARAM_INPUT_CURRENCY_KEY,
  )
  const queryParamOutputCurrencyAddress = params.get(
    QUERY_PARAM_OUTPUT_CURRENCY_KEY,
  )
  const localStorageInputCurrencyAddress = localStorage.getItem(
    LOCAL_STORAGE_INPUT_CURRENCY_KEY(context, chain),
  )
  const localStorageOutputCurrencyAddress = localStorage.getItem(
    LOCAL_STORAGE_OUTPUT_CURRENCY_KEY(context, chain),
  )
  const inputCurrencyAddress =
    queryParamInputCurrencyAddress ||
    localStorageInputCurrencyAddress ||
    undefined
  const outputCurrencyAddress =
    queryParamOutputCurrencyAddress ||
    localStorageOutputCurrencyAddress ||
    undefined
  return {
    inputCurrencyAddress,
    outputCurrencyAddress,
  }
}
