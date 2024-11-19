export function formatAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const hexToString = (hexString: string): string => {
  return Buffer.from(hexString.slice(2), 'hex').toString()
}
