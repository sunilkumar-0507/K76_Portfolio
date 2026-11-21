import { Helmet } from 'react-helmet-async'
import { NAV_ITEMS, SOCIALS } from '../../data/navigation'
import { OFFICES, SITE } from '../../utils/constants'

/** Path (in /public) of the 1200×630 social preview image, or '' if none yet. */
const OG_IMAGE = '/og-image.png'

interface SeoProps {
  title: string
  description?: string
  path?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  alternateName: SITE.shortName,
  url: SITE.url,
  logo: `${SITE.url}/brand/k76-mark.png`,
  email: SITE.email,
  telephone: SITE.phoneE164,
  foundingDate: String(SITE.founded),
  slogan: SITE.tagline,
  description: SITE.description,
  areaServed: 'IN',
  openingHours: 'Mo-Su 10:00-22:00',
  sameAs: SOCIALS.map((s) => s.href),
  address: OFFICES.map((o) => ({
    '@type': 'PostalAddress',
    streetAddress: o.lines.join(', '),
    addressLocality: o.city,
    addressRegion: 'Tamil Nadu',
    postalCode: o.postalCode,
    addressCountry: 'IN',
  })),
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: SITE.phoneE164,
    email: SITE.email,
    contactType: 'customer service',
    availableLanguage: ['en', 'ta'],
  },
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { '@id': `${SITE.url}/#organization` },
  hasPart: NAV_ITEMS.filter((n) => n.route).map((n) => ({
    '@type': 'WebPage',
    name: n.label,
    url: `${SITE.url}${n.route}`,
  })),
}

export function Seo({ title, description = SITE.description, path = '/', noindex, jsonLd }: SeoProps) {
  const url = `${SITE.url}${path === '/' ? '/' : path}`
  const fullTitle = title.includes('K76') ? title : `${title} — ${SITE.name}`
  const image = OG_IMAGE ? `${SITE.url}${OG_IMAGE}` : ''
  const ld = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {image ? <meta property="og:image" content={image} /> : null}
      {image ? <meta property="og:image:width" content="1200" /> : null}
      {image ? <meta property="og:image:height" content="630" /> : null}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:site" content="@k76bs" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}

      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  )
}
