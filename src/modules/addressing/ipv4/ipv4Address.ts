import { err, ok, type Result } from '@/types/result'
import type { IPv4Number } from '@/types/ipv4'

export const MAX_IPV4: IPv4Number = 0xffffffff

const OCTET_PATTERN = /^\d{1,3}$/

export function parseIpv4(input: string): Result<IPv4Number> {
  const text = input.trim()
  if (text === '') {
    return err('Enter an IPv4 address.')
  }

  const parts = text.split('.')
  if (parts.length !== 4) {
    return err(
      'An IPv4 address must have exactly four octets separated by dots, for example 192.168.1.10.',
    )
  }

  let value = 0
  for (const [index, part] of parts.entries()) {
    const position = index + 1

    if (!OCTET_PATTERN.test(part)) {
      return err(`Octet ${position} ("${part}") must be a whole number from 0 to 255.`)
    }
    if (part.length > 1 && part.startsWith('0')) {
      return err(`Octet ${position} ("${part}") must not have leading zeros.`)
    }

    const octet = Number(part)
    if (octet > 255) {
      return err(`Octet ${position} (${octet}) is greater than 255.`)
    }

    value = value * 256 + octet
  }

  return ok(value)
}

export function isValidIpv4Number(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_IPV4
}

export function ipv4ToOctets(value: IPv4Number): [number, number, number, number] {
  if (!isValidIpv4Number(value)) {
    throw new RangeError(`${value} is not a valid 32-bit IPv4 value.`)
  }
  return [(value >>> 24) & 255, (value >>> 16) & 255, (value >>> 8) & 255, value & 255]
}

export function formatIpv4(value: IPv4Number): string {
  return ipv4ToOctets(value).join('.')
}

export function ipv4ToBinary(value: IPv4Number): string {
  return ipv4ToOctets(value)
    .map((octet) => octet.toString(2).padStart(8, '0'))
    .join('.')
}