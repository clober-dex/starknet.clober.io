import { getAddress } from '@starknet-react/core'
import { getChecksumAddress, validateChecksumAddress } from 'starknet'

export const shortAddress = (address: string, length = 4): string => {
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`
}

export const isAddress = (address: string): boolean => {
  if (address.length === 0) {
    return false
  }
  return validateChecksumAddress(getChecksumAddress(address))
}

export const isAddressEqual = (a: `0x${string}`, b: `0x${string}`): boolean => {
  return getAddress(a) === getAddress(b)
}

export const isAddressesEqual = (
  a: `0x${string}`[],
  b: `0x${string}`[],
): boolean => {
  if (a.length !== b.length) {
    return false
  }
  a = a.map((address) => getAddress(address)).sort()
  b = b.map((address) => getAddress(address)).sort()
  return a.every((address, i) => isAddressEqual(address, b[i]))
}
