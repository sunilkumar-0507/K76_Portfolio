import { ArrowUpRight } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Footer } from '../components/common/Footer'
import { PageTransition } from '../components/common/PageTransition'
import { Seo } from '../components/common/Seo'

export default function NotFound() {
  return (
    <PageTransition>
      <Seo title="Page not found" path="/404" noindex />
      <main id="main" data-nav-theme="light" className="isolate grain relative flex min-h-[100svh] overflow-clip items-end bg-paper pb-16 pt-[calc(var(--nav-h)+4rem)]">
        <div className="wrap">
          <p className="t-label text-ink/50">Error 404</p>
          <h1 className="t-display t-mega mt-6">
            <span className="text-iris">Lost</span>
            <span className="text-lime">.</span>
          </h1>
          <span aria-hidden="true" className="mt-8 block h-1 w-16 rounded-full bg-lime" />
          <p className="t-lead mt-8 max-w-md text-ink/70">This page doesn’t exist — but what you were looking for probably does.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/" variant="ink" icon={<ArrowUpRight size={16} />}>
              Back home
            </Button>
            <Button to="/contact" variant="outline">
              Contact us
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  )
}
