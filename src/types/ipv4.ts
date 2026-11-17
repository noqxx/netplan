export type IPv4Number = number

export type PrefixLength = number

export type AddressClass = 'A' | 'B' | 'C' | 'D' | 'E'

export interface Ipv4Cidr {
  readonly address: IPv4Number
  readonly prefixLength: PrefixLength
}

export interface SubnetDetails {
  readonly address: IPv4Number
  readonly prefixLength: PrefixLength
  readonly subnetMask: IPv4Number
  readonly wildcardMask: IPv4Number
  readonly networkAddress: IPv4Number
  readonly broadcastAddress: IPv4Number
  readonly firstUsableHost: IPv4Number
  readonly lastUsableHost: IPv4Number
  readonly totalAddresses: number
  readonly usableHostCount: number
  readonly addressClass: AddressClass
}