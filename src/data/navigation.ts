export interface NavItem {
  label: string
  /** Section id on the home page */
  section: string
  /** Dedicated route, if the item also has its own page */
  route?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', section: 'top' },
  { label: 'About', section: 'about', route: '/about' },
  { label: 'Services', section: 'services', route: '/services' },
  { label: 'Work', section: 'work' },
  { label: 'K76 Learn', section: 'learn' },
  { label: 'Contact', section: 'contact', route: '/contact' },
]

export type SocialKey = 'instagram' | 'linkedin' | 'facebook' | 'x'

export interface Social {
  key: SocialKey
  label: string
  handle: string
  href: string
}

export const SOCIALS: Social[] = [
  { key: 'instagram', label: 'Instagram', handle: '@k76.in', href: 'https://www.instagram.com/k76.in' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    handle: 'K76 Business Solutions',
    href: 'https://www.linkedin.com/company/k76-business-solutions',
  },
  { key: 'facebook', label: 'Facebook', handle: 'K76', href: 'https://www.facebook.com/share/1bKEAMxf8T/' },
  { key: 'x', label: 'X', handle: '@k76bs', href: 'https://x.com/k76bs' },
]
