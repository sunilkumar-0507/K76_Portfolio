import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CircleAlert, CircleCheck, LoaderCircle, Mail } from 'lucide-react'
import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { z } from 'zod'
import { SERVICE_OPTIONS } from '../../data/services'
import { CONTACT_ACCESS_KEY, CONTACT_ENDPOINT, mailtoLink, SITE, whatsappLink } from '../../utils/constants'
import { Button } from '../common/Button'

const schema = z.object({
  name: z.string().trim().min(2, 'Please tell us your name.').max(80),
  email: z.string().trim().email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .refine((v) => v === '' || /^[+()\d\s-]{7,20}$/.test(v), 'Enter a valid phone number.'),
  company: z.string().trim().max(120),
  service: z.string().min(1, 'Choose the closest option.'),
  message: z.string().trim().min(20, 'A couple of sentences helps us prepare (20+ characters).').max(4000),
  /** Honeypot — must stay empty */
  website: z.string().max(0),
})

type FormValues = z.infer<typeof schema>

type Status =
  | { kind: 'idle' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }
  | { kind: 'mailto' }

function Field({
  label,
  error,
  children,
  optional,
  id,
}: {
  label: string
  error?: FieldError
  children: ReactNode
  optional?: boolean
  id: string
}) {
  return (
    <div className="field">
      <label htmlFor={id} className="t-label flex items-center justify-between text-paper/50">
        <span>{label}</span>
        {optional ? <span className="text-paper/30 normal-case tracking-normal">Optional</span> : null}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            id={`${id}-error`}
            className="mt-2 flex items-center gap-1.5 text-sm text-ember"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <CircleAlert size={14} aria-hidden="true" /> {error.message}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function inputProps(id: string, reg: UseFormRegisterReturn, error?: FieldError) {
  return {
    id,
    ...reg,
    'aria-invalid': error ? ('true' as const) : ('false' as const),
    'aria-describedby': error ? `${id}-error` : undefined,
    className: 'field-input',
  }
}

const composeBody = (v: FormValues) =>
  [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.phone && `Phone: ${v.phone}`,
    v.company && `Company: ${v.company}`,
    `Interested in: ${v.service}`,
  ]
    .filter(Boolean)
    .join('\n') + `\n\n${v.message}`

export function ContactForm() {
  const uid = useId()
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const endpointConfigured = CONTACT_ENDPOINT !== ''

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', company: '', service: '', message: '', website: '' },
  })

  const onSubmit = async (values: FormValues) => {
    setStatus({ kind: 'idle' })

    if (!endpointConfigured) {
      // No backend configured: hand the drafted message to the visitor's email app.
      window.location.href = mailtoLink(`Project enquiry — ${values.service}`, composeBody(values))
      setStatus({ kind: 'mailto' })
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...(CONTACT_ACCESS_KEY ? { access_key: CONTACT_ACCESS_KEY } : {}),
          subject: `Website enquiry — ${values.service}`,
          name: values.name,
          email: values.email,
          phone: values.phone,
          company: values.company,
          service: values.service,
          message: values.message,
          source: window.location.href,
        }),
        signal: controller.signal,
      })
      let ok = res.ok
      // Some providers answer 200 with { success: false }.
      try {
        const data = (await res.clone().json()) as { success?: boolean; ok?: boolean }
        if (data && (data.success === false || data.ok === false)) ok = false
      } catch {
        /* non-JSON response — rely on status code */
      }
      if (!ok) throw new Error(`Request failed (${res.status})`)
      setStatus({ kind: 'success' })
      reset()
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === 'AbortError'
      setStatus({
        kind: 'error',
        message: aborted
          ? 'The request timed out. Please try again, or reach us directly on WhatsApp or email.'
          : 'We couldn’t send your message just now. Please try again, or reach us directly on WhatsApp or email.',
      })
    } finally {
      window.clearTimeout(timeout)
    }
  }

  const id = (n: string) => `${uid}-${n}`
  const values = getValues()
  const whatsappText = values.name
    ? `Hi K76, I'm ${values.name}. I'm interested in ${values.service || 'working with you'}.`
    : 'Hi K76, I would like to discuss a project.'

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-describedby={`${uid}-status`} className="relative">
      <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
        <Field label="Name" id={id('name')} error={errors.name}>
          <input {...inputProps(id('name'), register('name'), errors.name)} autoComplete="name" placeholder="Your full name" />
        </Field>
        <Field label="Email" id={id('email')} error={errors.email}>
          <input
            {...inputProps(id('email'), register('email'), errors.email)}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Phone" id={id('phone')} error={errors.phone} optional>
          <input
            {...inputProps(id('phone'), register('phone'), errors.phone)}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+91"
          />
        </Field>
        <Field label="Company" id={id('company')} error={errors.company} optional>
          <input {...inputProps(id('company'), register('company'), errors.company)} autoComplete="organization" placeholder="Business name" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Service interested in" id={id('service')} error={errors.service}>
            <select {...inputProps(id('service'), register('service'), errors.service)} defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Project description" id={id('message')} error={errors.message}>
            <textarea
              {...inputProps(id('message'), register('message'), errors.message)}
              rows={4}
              placeholder="What are you building, and where do you want the business to be in 12 months?"
            />
          </Field>
        </div>
        {/* Honeypot — hidden from people, tempting for bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={id('website')}>Website</label>
          <input id={id('website')} tabIndex={-1} autoComplete="off" {...register('website')} />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          variant="lime"
          size="lg"
          disabled={isSubmitting}
          icon={isSubmitting ? <LoaderCircle size={18} className="animate-spin" /> : endpointConfigured ? <ArrowUpRight size={18} /> : <Mail size={18} />}
        >
          {isSubmitting ? 'Sending…' : endpointConfigured ? 'Send enquiry' : 'Send via email'}
        </Button>
        <a
          href={whatsappLink(whatsappText)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display text-sm text-paper/60 underline decoration-paper/25 underline-offset-4 hover:text-lime"
        >
          Prefer WhatsApp? Message us directly
        </a>
      </div>

      <p className="mt-5 text-xs text-paper/40">
        By submitting, you agree to be contacted by K76 about your enquiry. Nothing is shared with third parties.
      </p>

      <div id={`${uid}-status`} role="status" aria-live="polite" className="mt-6 min-h-[1px]">
        <AnimatePresence mode="wait">
          {status.kind === 'success' ? (
            <motion.p
              key="ok"
              className="flex items-start gap-3 border border-lime/40 bg-lime/10 p-4 text-sm text-paper"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CircleCheck size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
              Thank you — your enquiry has reached the K76 team. We reply within one business day.
            </motion.p>
          ) : null}
          {status.kind === 'error' ? (
            <motion.p
              key="err"
              className="flex items-start gap-3 border border-ember/50 bg-ember/10 p-4 text-sm text-paper"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <CircleAlert size={18} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />
              <span>
                {status.message}{' '}
                <a className="underline" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </span>
            </motion.p>
          ) : null}
          {status.kind === 'mailto' ? (
            <motion.p
              key="mail"
              className="flex items-start gap-3 border border-paper/20 p-4 text-sm text-paper/80"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Mail size={18} className="mt-0.5 shrink-0 text-lime" aria-hidden="true" />
              <span>
                Your email app should now open with the message drafted to {SITE.email}. It isn’t sent until you press send
                there. Nothing opened?{' '}
                <a className="underline" href={whatsappLink(whatsappText)} target="_blank" rel="noopener noreferrer">
                  Message us on WhatsApp
                </a>
                .
              </span>
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  )
}
