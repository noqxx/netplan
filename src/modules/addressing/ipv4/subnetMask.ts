import { err, ok, type Result } from '@/types/result'
import type { IPv4Number, PrefixLength } from '@/types/ipv4'
import { MAX_IPV4, formatIpv4, isValidIpv4Number, parseIpv4 } from './ipv4Address'

export const MIN_PREFIX_LENGTH = 0
export const MAX_PREFIX_LENGTH = 32

const PREFIX_PATTERN = /^\d{1,2}$/

export function isValidPrefixLength(value: number): boolean {
  return (
    Number.isInteger(value) && value >= MIN_PREFIX_LENGTH && value <= MAX_PREFIX_LENGTH
  )
}

function assertPrefixLength(prefixLength: number): void {
  if (!isValidPrefixLength(prefixLength)) {
    throw new RangeError(`${prefixLength} is not a valid prefix length (0 to 32).`)
  }
}

function assertIpv4Number(value: number): void {
  if (!isValidIpv4Number(value)) {
    throw new RangeError(`${value} is not a valid 32-bit IPv4 value.`)
  }
}

export function prefixToMask(prefixLength: PrefixLength): IPv4Number {
  assertPrefixLength(prefixLength)
  if (prefixLength === 0) {
    return 0
  }
  return (MAX_IPV4 << (32 - prefixLength)) >>> 0
}

export function maskToWildcard(mask: IPv4Number): IPv4Number {
  assertIpv4Number(mask)
  return ~mask >>> 0
}

export function prefixToWildcard(prefixLength: PrefixLength): IPv4Number {
  return maskToWildcard(prefixToMask(prefixLength))
}

export function maskToPrefix(mask: IPv4Number): Result<PrefixLength> {
  assertIpv4Number(mask)

  let prefixLength = 0
  while (
    prefixLength < MAX_PREFIX_LENGTH &&
    ((mask >>> (31 - prefixLength)) & 1) === 1
  ) {
    prefixLength++
  }

  if (prefixToMask(prefixLength) !== mask) {
    return err(
      `${formatIpv4(mask)} is not a valid subnet mask: its 1-bits must be continuous from the left, with no 0 between them.`,
    )
  }
  return ok(prefixLength)
}

export function parsePrefixLength(input: string): Result<PrefixLength> {
  const text = input.trim().replace(/^\//, '')
  if (!PREFIX_PATTERN.test(text)) {
    return err('A prefix length must be a whole number from 0 to 32, for example /24.')
  }

  const value = Number(text)
  if (value > MAX_PREFIX_LENGTH) {
    return err(`Prefix length /${value} is greater than /32.`)
  }
  return ok(value)
}

export function parsePrefixOrMask(input: string): Result<PrefixLength> {
  const text = input.trim()
  if (text === '') {
    return err('Enter a prefix length such as /24 or a subnet mask such as 255.255.255.0.')
  }

  if (text.includes('.')) {
    const parsed = parseIpv4(text)
    if (!parsed.ok) {
      return err(`Subnet mask: ${parsed.error}`)
    }
    return maskToPrefix(parsed.value)
  }

  return parsePrefixLength(text)
}