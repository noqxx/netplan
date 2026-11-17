export interface NavItem {
  readonly to: string
  readonly label: string
}

export const navItems: readonly NavItem[] = [
  { to: '/', label: 'Home' },
]