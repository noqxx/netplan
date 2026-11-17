import { describe, expect, it } from 'vitest'
import { formatIpv4, parseIpv4 } from './ipv4Address'
import {
  isValidPrefixLength,
  maskToPrefix,
  maskToWildcard,
  parsePrefixLength,
  parsePrefixOrMask,
  prefixToMask,
  prefixToWildcard,
} from './subnetMask'

function ip(text: string): number {
  const parsed = parseIpv4(text)
  if (!parsed.ok) {
    throw new Error(`Test setup error: ${parsed.error}`)
  }
  return parsed.value
}

describe('prefixToMask', () => {
  it.each([
    [0, '0.0.0.0'],
    [1, '128.0.0.0'],
    [8, '255.0.0.0'],
    [12, '255.240.0.0'],
    [16, '255.255.0.0'],
    [20, '255.255.240.0'],
    [24, '255.255.255.0'],
    [25, '255.255.255.128'],
    [26, '255.255.255.192'],
    [27, '255.255.255.224'],
    [28, '255.255.255.240'],
    [29, '255.255.255.248'],
    [30, '255.255.255.252'],
    [31, '255.255.255.254'],
    [32, '255.255.255.255'],
  ])('/%i is %s', (prefixLength, expectedMask) => {
    expect(formatIpv4(prefixToMask(prefixLength))).toBe(expectedMask)
  })

  it('throws on impossible prefix lengths', () => {
    expect(() => prefixToMask(-1)).toThrow(RangeError)
    expect(() => prefixToMask(33)).toThrow(RangeError)
    expect(() => prefixToMask(24.5)).toThrow(RangeError)
  })
})

describe('wildcard masks', () => {
  it.each([
    [0, '255.255.255.255'],
    [8, '0.255.255.255'],
    [20, '0.0.15.255'],
    [24, '0.0.0.255'],
    [26, '0.0.0.63'],
    [30, '0.0.0.3'],
    [32, '0.0.0.0'],
  ])('/%i has wildcard %s', (prefixLength, expectedWildcard) => {
    expect(formatIpv4(prefixToWildcard(prefixLength))).toBe(expectedWildcard)
  })

  it('flips every bit of the subnet mask', () => {
    expect(formatIpv4(maskToWildcard(ip('255.255.255.192')))).toBe('0.0.0.63')
  })
})

describe('maskToPrefix', () => {
  it('converts every valid mask back to its prefix length', () => {
    for (let prefixLength = 0; prefixLength <= 32; prefixLength++) {
      expect(maskToPrefix(prefixToMask(prefixLength))).toEqual({
        ok: true,
        value: prefixLength,
      })
    }
  })

  it.each(['255.0.255.0', '255.255.255.1', '0.255.255.255', '255.255.254.255', '128.0.0.1'])(
    'rejects the non-continuous mask %s',
    (mask) => {
      expect(maskToPrefix(ip(mask)).ok).toBe(false)
    },
  )
})

describe('parsePrefixLength', () => {
  it('accepts a number with or without a slash', () => {
    expect(parsePrefixLength('24')).toEqual({ ok: true, value: 24 })
    expect(parsePrefixLength('/24')).toEqual({ ok: true, value: 24 })
    expect(parsePrefixLength(' /0 ')).toEqual({ ok: true, value: 0 })
    expect(parsePrefixLength('/32')).toEqual({ ok: true, value: 32 })
  })

  it.each(['', '/', '33', '/100', '-1', '24.5', 'abc', '//24'])('rejects %j', (input) => {
    expect(parsePrefixLength(input).ok).toBe(false)
  })

  it('explains when the prefix is too large', () => {
    expect(parsePrefixLength('/33')).toEqual({
      ok: false,
      error: 'Prefix length /33 is greater than /32.',
    })
  })
})

describe('parsePrefixOrMask', () => {
  it('accepts a prefix length', () => {
    expect(parsePrefixOrMask('/26')).toEqual({ ok: true, value: 26 })
  })

  it('accepts a subnet mask and converts it to a prefix length', () => {
    expect(parsePrefixOrMask('255.255.255.192')).toEqual({ ok: true, value: 26 })
    expect(parsePrefixOrMask(' 255.255.0.0 ')).toEqual({ ok: true, value: 16 })
  })

  it.each(['', '   ', '255.0.255.0', '255.255.255.256', '255.255.255'])(
    'rejects %j',
    (input) => {
      expect(parsePrefixOrMask(input).ok).toBe(false)
    },
  )
})

describe('isValidPrefixLength', () => {
  it('accepts whole numbers from 0 to 32 only', () => {
    expect(isValidPrefixLength(0)).toBe(true)
    expect(isValidPrefixLength(32)).toBe(true)
    expect(isValidPrefixLength(33)).toBe(false)
    expect(isValidPrefixLength(-1)).toBe(false)
    expect(isValidPrefixLength(8.5)).toBe(false)
  })
})