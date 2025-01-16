const P =
  3618502788666131213697322783095070105623107215331596699973092056135872020481n

export const toCommaSeparated = (number: string) => {
  const parts = number.split('.')
  const integer = parts[0]
  const decimal = parts[1]
  const formattedInteger =
    (integer.startsWith('-') ? '-' : '') +
    integer.replace('-', '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger
}

// https://docs.starknet.io/architecture-and-concepts/smart-contracts/serialization-of-cairo-types/#data_types_of_252_bits_or_less
export function encodeNumber(number: bigint) {
  if (number >= 0n) {
    return number
  }
  return P + number
}

export function decodeI32(number: bigint) {
  const MAX_I32 = 2n ** 31n - 1n
  if (number <= MAX_I32) {
    return number
  }
  return number - P
}
