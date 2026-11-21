/**
 * Business verticals, practices and programmes.
 * Sources: the K76 brief and the live k76.in /services and /k76-learn pages.
 */

export type VerticalGlyph = 'grid' | 'steps' | 'modules'

export interface Vertical {
  id: string
  index: string
  title: string
  kicker: string
  summary: string
  items: string[]
  glyph: VerticalGlyph
  anchor?: string
}

export const VERTICALS: Vertical[] = [
  {
    id: 'solutions',
    index: '01',
    title: 'Business Solutions',
    kicker: 'Build · Market · Automate',
    summary:
      'One senior team across software, marketing, branding and automation — so growth stops being a multi-vendor maze.',
    items: [
      'Website Development',
      'Custom Software Development',
      'Web Application Development',
      'Digital Marketing',
      'Branding and Identity',
      'Business Automation',
      'Business Consulting',
    ],
    glyph: 'grid',
  },
  {
    id: 'learn',
    index: '02',
    title: 'K76 Learn',
    kicker: 'EdTech & Placement',
    summary:
      'Cohort-based, career-focused training taught by working professionals — with capstone projects, internships and placement preparation.',
    items: [
      'Full Stack Development',
      'Frontend Development',
      'Backend Development',
      'UI/UX Design',
      'Programming',
      'Digital Marketing',
      'Practical Industry Training',
    ],
    glyph: 'steps',
    anchor: 'learn',
  },
  {
    id: 'products',
    index: '03',
    title: 'K76 Products',
    kicker: 'Software we own & ship',
    summary:
      'Business software built from what we learn on client work — systems that run operations, money and customer relationships.',
    items: [
      'CRM Platforms',
      'Business Management Systems',
      'Financial Management Software',
      'SaaS Applications',
      'Custom Business Tools',
    ],
    glyph: 'modules',
  },
]

export interface Practice {
  title: string
  line: string
  items: string[]
}

/** Detailed service practices, as listed on k76.in/services */
export const PRACTICES: Practice[] = [
  {
    title: 'Digital Marketing',
    line: 'Performance-led marketing that grows pipeline, not just impressions.',
    items: [
      'SEO & Content',
      'Google Ads',
      'Meta Ads',
      'Social Media',
      'Performance Marketing',
      'Email Marketing',
      'Lead Generation',
    ],
  },
  {
    title: 'Software Development',
    line: 'Web, mobile and enterprise systems engineered for speed and scale.',
    items: [
      'Business Websites',
      'E-commerce',
      'CRM & ERP',
      'School / College / Hospital Systems',
      'Custom Software',
      'Web & Mobile Apps',
      'API & Cloud',
    ],
  },
  {
    title: 'Branding & Design',
    line: 'Identity systems and creative that make your brand impossible to ignore.',
    items: [
      'Logo & Identity',
      'UI/UX Design',
      'Packaging',
      'Graphic Design',
      'Video Editing',
      'Corporate Profile',
      'Brand Guidelines',
    ],
  },
  {
    title: 'AI Solutions',
    line: 'Automations and AI assistants that compound time, not headcount.',
    items: [
      'AI Chatbots',
      'WhatsApp Automation',
      'CRM Automation',
      'Lead Automation',
      'Workflow Automation',
      'Customer Support AI',
      'Custom AI Agents',
    ],
  },
  {
    title: 'Business Consulting',
    line: 'Strategy, go-to-market and operations to turn ambition into outcomes.',
    items: ['Growth Strategy', 'Go-to-Market', 'Operations', 'Growth Analytics & Reporting'],
  },
]

export interface Course {
  title: string
  weeks: number
  topics: string
}

/** Featured K76 Learn courses, as listed on k76.in/k76-learn */
export const COURSES: Course[] = [
  { title: 'Web Development', weeks: 16, topics: 'HTML, CSS, JS, React and deployment.' },
  { title: 'Digital Marketing', weeks: 12, topics: 'SEO, Ads, Social, Analytics, Funnels.' },
  { title: 'Python Programming', weeks: 12, topics: 'From basics to backend and automation.' },
  { title: 'Java Programming', weeks: 12, topics: 'Core Java, OOP, Spring foundations.' },
  { title: 'UI / UX Design', weeks: 10, topics: 'Research, wireframes, Figma, design systems.' },
  { title: 'Graphic Design', weeks: 8, topics: 'Brand, social creatives, print, motion basics.' },
]

export const LEARN_PILLARS = [
  'Industry-mentor led classes',
  'Hands-on capstone projects',
  'Internships with real companies',
  'Placement assistance and prep',
  'Lifetime alumni community',
]

export const INDUSTRIES = [
  'Education',
  'Healthcare',
  'Real Estate',
  'E-commerce',
  'SaaS',
  'Hospitality',
  'Manufacturing',
  'Finance',
  'Legal',
  'Travel',
  'Logistics',
  'Wellness',
]

/** Options for the contact form "service interested in" field */
export const SERVICE_OPTIONS = [
  'Website Development',
  'Custom Software / Web App',
  'CRM / ERP / Business Systems',
  'Digital Marketing',
  'Branding & Design',
  'AI & Business Automation',
  'Business Consulting',
  'K76 Learn — Training',
  'K76 Products',
  'Not sure yet',
] as const

export const PROCESS = [
  {
    index: '01',
    title: 'Discover',
    body: 'We audit, listen and pinpoint where growth is leaking — your customers, your numbers, your current tools.',
  },
  {
    index: '02',
    title: 'Strategize',
    body: 'Goals become a plan: scope, priorities, budget and the metrics we will be judged against. Signed before anything is built.',
  },
  {
    index: '03',
    title: 'Design',
    body: 'Brand, interface and flows designed around how your customers actually decide — reviewed with you screen by screen.',
  },
  {
    index: '04',
    title: 'Develop',
    body: 'Senior engineers ship in short, transparent sprints. You see working software every week, not a reveal at the end.',
  },
  {
    index: '05',
    title: 'Launch',
    body: 'Testing, performance, SEO and analytics are in place before go-live. Your team is trained to run it on day one.',
  },
  {
    index: '06',
    title: 'Grow',
    body: 'Measure, optimise and compound. Marketing, automation and new features keep moving the numbers month over month.',
  },
]
