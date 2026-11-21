/**
 * Selected work.
 *
 * Source: k76.in/portfolio (client, project, category and stack exactly as published there).
 * The live site does not publish live URLs or case-study copy, so:
 *  - `liveUrl` is left empty until confirmed — the UI hides the link when it is missing.
 *  - `description` only restates the published facts. Replace with approved case-study copy.
 *  - `image` is optional. Drop a WebP/AVIF screenshot into /public/images/projects/ and set
 *    the path; until then an art-directed typographic cover is rendered instead.
 */

export type ProjectCategory = 'Websites' | 'Software' | 'Branding' | 'Marketing' | 'Apps'

export interface Project {
  slug: string
  name: string
  client: string
  category: ProjectCategory
  description: string
  stack: string[]
  liveUrl?: string
  image?: { src: string; alt: string; width: number; height: number }
  /** Cover art direction when no image is present */
  cover: { bg: string; fg: string; accent: string }
}

export const PROJECTS: Project[] = [
  {
    slug: 'tenkasi-fresh',
    name: 'Tenkasi Fresh',
    client: 'Govt Society Tamil Nadu',
    category: 'Websites',
    description:
      'Website delivered for Govt Society Tamil Nadu under the Tenkasi Fresh name, built on Next.js with Shopify.',
    stack: ['Next.js', 'Shopify'],
    cover: { bg: '#1b1b1a', fg: '#f5f3ed', accent: '#c8f169' },
  },
  {
    slug: 'daily-pans',
    name: 'Daily Pans',
    client: 'JCS',
    category: 'Websites',
    description: 'Website for JCS, published as Daily Pans, engineered on a Node and Postgres stack.',
    stack: ['Node', 'Postgres'],
    cover: { bg: '#e0dccf', fg: '#171717', accent: '#e8643a' },
  },
  {
    slug: 'krishna-cafe',
    name: 'Krishna Cafe',
    client: 'Anbalayaas',
    category: 'Marketing',
    description: 'Marketing engagement for Anbalayaas around Krishna Cafe, with a Next.js and Shopify build.',
    stack: ['Next.js', 'Shopify'],
    cover: { bg: '#c8f169', fg: '#171717', accent: '#171717' },
  },
  {
    slug: 'vinothini-crackers',
    name: 'Vinothini Crackers',
    client: 'Gopi',
    category: 'Websites',
    description: 'Web presence for Vinothini Crackers, supported by Meta and Google Ads campaigns.',
    stack: ['Meta Ads', 'Google Ads'],
    cover: { bg: '#e8643a', fg: '#111111', accent: '#f5f3ed' },
  },
  {
    slug: 'friends-finance',
    name: 'Friends Finance',
    client: 'Kaniah',
    category: 'Apps',
    description: 'App build for Kaniah’s Friends Finance across web and mobile — Next.js, React Native and Firebase.',
    stack: ['Next.js', 'React Native', 'Firebase'],
    cover: { bg: '#111111', fg: '#f5f3ed', accent: '#c8f169' },
  },
]
