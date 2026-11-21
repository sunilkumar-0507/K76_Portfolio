/**
 * Company facts. Everything here was taken from the live k76.in website
 * (home, about, services, contact and footer) — update in one place.
 */

export interface Office {
  label: string
  lines: string[]
  city: string
  postalCode: string
}

const rawSiteUrl = import.meta.env.VITE_SITE_URL || 'https://k76.in'

export const SITE = {
  name: 'K76 Business Solutions',
  shortName: 'K76',
  url: rawSiteUrl.replace(/\/$/, ''),
  tagline: 'Build Smarter. Market Better. Grow Faster.',
  founded: 2021,
  email: 'hello@k76.in',
  phoneDisplay: '+91 91762 37622',
  phoneE164: '+919176237622',
  whatsappNumber: '919176237622',
  hours: 'Mon–Sun · 10am to 10pm IST',
  description:
    'K76 Business Solutions builds websites, custom software, CRMs, brands, marketing and AI automation for growing businesses — and trains the next generation of talent through K76 Learn.',
} as const

export const OFFICES: Office[] = [
  {
    label: 'Chennai — Kalavakkam',
    lines: ['SSN IFOUND, Kalavakkam', 'Thirupporur P/o'],
    city: 'Chennai',
    postalCode: '603110',
  },
  {
    label: 'Chennai — Velachery',
    lines: ['No 280, Velachery Main Road', 'Rajakilpakkam'],
    city: 'Chennai',
    postalCode: '600073',
  },
  {
    label: 'Tenkasi',
    lines: ['Arunachalapuram', 'Kadayanallur Taluk'],
    city: 'Tenkasi',
    postalCode: '627862',
  },
]

export const whatsappLink = (text?: string) =>
  `https://wa.me/${SITE.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const mailtoLink = (subject?: string, body?: string) => {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  const qs = params.toString().replace(/\+/g, '%20')
  return `mailto:${SITE.email}${qs ? `?${qs}` : ''}`
}

export const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT?.trim() || ''
export const CONTACT_ACCESS_KEY = import.meta.env.VITE_CONTACT_ACCESS_KEY?.trim() || ''

/** Timings shared by the animation system (seconds). */
export const MOTION = {
  fast: 0.45,
  base: 0.9,
  slow: 1.4,
  ease: 'expo.out',
  easeInOut: 'power3.inOut',
} as const
