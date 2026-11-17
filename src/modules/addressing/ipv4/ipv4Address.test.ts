import { describe, expect, it } from 'vitest'
import {
  MAX_IPV4,
  formatIpv4,
  ipv4ToBinary,
  ipv4ToOctets,
  isValidIpv4Number,
  parseIpv4,
} from './ipv4Address'

describe('parseIpv4', () => {
  it('converts dotted decimal to a 32-bit number', () => {
    expect(parseIpv4('192.168.1.10')).toEqual({ ok: true, value: 3232235786 })
    expect(parseIpv4('10.0.0.1')).toEqual({ ok: true, value: 167772161 })
  })

  it('handles the lowest and highest addresses', () => {
    expect(parseIpv4('0.0.0.0')).toEqual({ ok: true, value: 0 })
    expect(parseIpv4('255.255.255.255')).toEqual({ ok: true, value: MAX_IPV4 })
  })

  it('ignores spaces around the address', () => {
    expect(parseIpv4('  10.0.0.1  ')).toEqual({ ok: true, value: 167772161 })
  })

  it.each([
    '',
    '   ',
    '192.168.1',
    '192.168.1.1.1',
    '192.168..1',
    '192.168.1.256',
    '192.168.01.1',
    '192.168.1.a',
    '-1.0.0.0',
    '1e2.0.0.0',
    '192.168.1.1/24',
  ])('rejects %j', (input) => {
    expect(parseIpv4(input).ok).toBe(false)
  })

  it('explains which octet is wrong', () => {
    expect(parseIpv4('192.168.1.256')).toEqual({
      ok: false,
      error: 'Octet 4 (256) is greater than 255.',
    })
  })
})

describe('formatIpv4', () => {
  it('converts a 32-bit number back to dotted decimal', () => {
    expect(formatIpv4(3232235786)).toBe('192.168.1.10')
    expect(formatIpv4(0)).toBe('0.0.0.0')
    expect(formatIpv4(MAX_IPV4)).toBe('255.255.255.255')
  })

  it.each(['1.2.3.4', '172.16.254.1', '128.0.0.0', '223.255.255.254'])(
    'round-trips %s',
    (address) => {
      const parsed = parseIpv4(address)
      expect(parsed.ok).toBe(true)
      if (parsed.ok) {
        expect(formatIpv4(parsed.value)).toBe(address)
      }
    },
  )

  it('throws on values outside the 32-bit range', () => {
    expect(() => formatIpv4(-1)).toThrow(RangeError)
    expect(() => formatIpv4(MAX_IPV4 + 1)).toThrow(RangeError)
    expect(() => formatIpv4(1.5)).toThrow(RangeError)
  })
})

describe('ipv4ToOctets', () => {
  it('splits a number into its four octets', () => {
    expect(ipv4ToOctets(3232235786)).toEqual([192, 168, 1, 10])
  })
})

describe('ipv4ToBinary', () => {
  it('shows each octet as 8 bits', () => {
    expect(ipv4ToBinary(3232235786)).toBe('11000000.10101000.00000001.00001010')
    expect(ipv4ToBinary(0)).toBe('00000000.00000000.00000000.00000000')
  })
})

describe('isValidIpv4Number', () => {
  it('accepts whole numbers from 0 to 4,294,967,295', () => {
    expect(isValidIpv4Number(0)).toBe(true)
    expect(isValidIpv4Number(MAX_IPV4)).toBe(true)
  })

  it('rejects anything else', () => {
    expect(isValidIpv4Number(-1)).toBe(false)
    expect(isValidIpv4Number(MAX_IPV4 + 1)).toBe(false)
    expect(isValidIpv4Number(2.5)).toBe(false)
  })
})