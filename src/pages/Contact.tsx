import { Footer } from '../components/common/Footer'
import { PageTransition } from '../components/common/PageTransition'
import { organizationJsonLd, Seo } from '../components/common/Seo'
import { Contact } from '../components/sections/Contact'
import { SITE } from '../utils/constants'

const contactJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  url: `${SITE.url}/contact`,
  name: 'Contact K76 Business Solutions',
  mainEntity: { '@id': `${SITE.url}/#organization` },
}

export default function ContactPage() {
  return (
    <PageTransition>
      <Seo
        title="Contact K76 — Start a project"
        description="Tell K76 about your business and where you want to go. WhatsApp or call +91 91762 37622, email hello@k76.in — offices in Chennai and Tenkasi."
        path="/contact"
        jsonLd={[organizationJsonLd, contactJsonLd]}
      />
      <main id="main" data-nav-theme="dark" className="bg-char pt-[var(--nav-h)]">
        <Contact index="C" headingLevel="h1" />
      </main>
      <Footer />
    </PageTransition>
  )
}
