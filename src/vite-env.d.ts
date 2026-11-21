/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute URL that receives contact-form submissions as JSON (Formspree, Web3Forms, your own API…). */
  readonly VITE_CONTACT_ENDPOINT?: string
  /** Optional access key forwarded as `access_key` (required by Web3Forms). */
  readonly VITE_CONTACT_ACCESS_KEY?: string
  /** Canonical origin used for SEO tags. Defaults to https://k76.in */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
