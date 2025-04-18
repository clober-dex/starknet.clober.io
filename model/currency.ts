export type Currency = {
  address: `0x${string}`
  name: string
  symbol: string
  decimals: number
  icon?: string
  isVerified?: boolean
}

export type CurrencyFlow = {
  currency: Currency
  amount: string
  direction: 'in' | 'out'
}

export function getLogo(currency?: Currency): string {
  if (!currency) {
    return ''
  }
  if (currency.icon) {
    return currency.icon
  }
  return `https://assets.odos.xyz/tokens/${encodeURIComponent(
    currency.symbol,
  )}.webp`
}
