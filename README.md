# K76 Business Solutions — website

React 19 + TypeScript + Vite, Tailwind CSS v4, GSAP/ScrollTrigger, Anime.js v4, Lenis, Framer Motion.

```bash
npm install
cp .env.example .env   # configure the contact form endpoint
npm run dev            # http://localhost:5173
npm run build          # type-check + production build → dist/
npm run preview
```

## Brand assets

The original logo is `public/brand/k76-logo.jpeg`. Every other logo file is cut from those same pixels
(cropped to the tile, corners made transparent):

- `brand/k76-mark.webp` / `.png` (388px) and `brand/k76-mark-160.webp` / `.png`, used by `BrandMark`
- `favicon-48.png`, `icon-192.png`, `apple-touch-icon.png` and `og-image.png`

If the logo changes, replace the original and regenerate these files from it.

## Content

All company facts live in data files. Edit these, not the components:

| File | What it holds |
| --- | --- |
| `src/utils/constants.ts` | Name, email, phone/WhatsApp, hours, office addresses |
| `src/data/navigation.ts` | Nav items, social links |
| `src/data/services.ts` | Verticals, practices, K76 Learn courses, process stages, form options |
| `src/data/company.ts` | About copy, mission/vision, team, milestones, figures |

## Contact form

The form posts JSON (`name, email, phone, company, service, message, source`) to `VITE_CONTACT_ENDPOINT`.

- **Formspree:** `VITE_CONTACT_ENDPOINT=https://formspree.io/f/<id>`
- **Web3Forms:** `VITE_CONTACT_ENDPOINT=https://api.web3forms.com/submit` and `VITE_CONTACT_ACCESS_KEY=<key>`
- **Your own API:** return any 2xx status. Returning `{ "success": false }` counts as a failure.

If no endpoint is set, the button reads **Send via email** and opens a pre-filled email to hello@k76.in. The
form never reports success unless the endpoint accepted the message. WhatsApp is always available as well.

## SEO

- Each route sets its title, description, canonical URL, Open Graph and Twitter tags, and JSON-LD
  (`src/components/common/Seo.tsx`).
- `public/robots.txt` and `public/sitemap.xml` list `/`, `/about`, `/services` and `/contact`.
- Social preview image: `public/og-image.png` (1200×630).

## Animation system

- `src/animations/gsapConfig.ts`: plugin registration and shared media queries.
- `src/animations/scrollAnimations.ts`: line reveals, word scrubbing, parallax.
- `src/animations/animeAnimations.ts`: SVG stroke drawing, signal loops, counters, micro-interactions.
- `src/hooks/useLenis.ts`: one Lenis instance driven by the GSAP ticker, so Lenis and ScrollTrigger share a
  single animation-frame loop.
- `src/hooks/useGsap.ts`: every section animates inside a `gsap.context`, which is reverted on unmount.

Reduced-motion users get static content and native scrolling. Touch devices get no custom cursor, no magnetic
effects and no Lenis.

## Deploying

This is a single-page app, so the host must rewrite unknown paths to `index.html`. Both `public/_redirects`
(Netlify) and `vercel.json` (Vercel) are included. On Apache or Nginx, add the equivalent fallback rule.
