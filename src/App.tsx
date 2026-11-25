
import { useEffect, useRef, useState } from 'react'
import { en, ar } from './i18n.ts'
import { ArrowUp, CalendarBlank, ChartLineUp, Check, CheckCircle, CheckSquare, Globe, Kanban, List, Plus, Users, X } from '@phosphor-icons/react'

type Dict = typeof en
type Lang = 'en' | 'ar'
const SLUG = '011-productivity-saas'
const BRAND = 'Flowboard'

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`${className ?? ''} transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      {children}
    </div>
  )
}

function TaglineReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const words = text.split(' ')
  return (
    <p ref={ref} className="heading-3 mx-auto max-w-[680px] text-center" aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" style={{ transitionDelay: visible ? `${i * 80}ms` : '0ms' }}
          className={`inline-block transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'opacity-100' : 'opacity-30'}`}>
          {w}
          {i < words.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </p>
  )
}

const BENEFIT_ICONS = [CheckSquare, Kanban, CalendarBlank, Users]
const STEP_ICONS = [Plus, Kanban, ChartLineUp]

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem(`lang-${SLUG}`) as Lang) || 'en' } catch { return 'en' }
  })
  const t: Dict = (lang === 'ar' ? ar : en) as unknown as Dict
  const rtl = lang === 'ar'
  const [menuOpen, setMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const [yearly, setYearly] = useState(false)
  const [mockTab, setMockTab] = useState(0)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailDone, setEmailDone] = useState(false)
  const [emailBusy, setEmailBusy] = useState(false)
  const [cookie, setCookie] = useState<string | null>(() => {
    try { return localStorage.getItem(`cookie-${SLUG}`) } catch { return null }
  })
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = rtl ? 'rtl' : 'ltr'
    document.title = t.meta.title
    try { localStorage.setItem(`lang-${SLUG}`, lang) } catch { /* storage unavailable */ }
  }, [lang, rtl, t.meta.title])

  const switchLang = (l: Lang) => setLang(l)
  const navLinks = [
    { href: '#features', label: t.nav.features },
    { href: '#how', label: t.nav.how },
    { href: '#pricing', label: t.nav.pricing },
    { href: '#faq', label: t.nav.faq },
  ]
  const mockMsgs = mockTab === 0 ? t.mock.msgs : t.mock.resolved

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) { setEmailError(t.form.errorRequired); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setEmailError(t.form.errorEmail); return }
    setEmailError('')
    setEmailBusy(true)
    window.setTimeout(() => { setEmailBusy(false); setEmailDone(true) }, 600)
  }

  const setCookieChoice = (v: string) => {
    try { localStorage.setItem(`cookie-${SLUG}`, v) } catch { /* storage unavailable */ }
    setCookie(v)
  }

  return (
    <div className="min-h-screen bg-bg font-sans text-ink antialiased">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white">
        {t.nav.skip}
      </a>

      <header className="fixed inset-x-0 top-4 z-40 px-4">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-black/10 bg-surface/90 px-4 py-2 shadow-lg backdrop-blur-md">
          <a href="#top" className="title-1 flex items-center gap-2" aria-current="page">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-lg font-bold text-white">{BRAND.charAt(0)}</span>
            {BRAND}
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}><a className="title-4 text-mute transition-colors duration-300 hover:text-ink" href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-black/10 p-1" role="group" aria-label="Language">
              <Globe size={16} className="mx-1 text-mute" aria-hidden="true" />
              <button type="button" onClick={() => switchLang('en')} aria-pressed={lang === 'en'}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors duration-300 ${lang === 'en' ? 'bg-accent text-white' : 'text-mute hover:text-ink'}`}>EN</button>
              <button type="button" onClick={() => switchLang('ar')} aria-pressed={lang === 'ar'}
                className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors duration-300 ${lang === 'ar' ? 'bg-accent text-white' : 'text-mute hover:text-ink'}`}>ع</button>
            </div>
            <a href="#trial" className="button-sm hidden rounded-lg bg-accent px-3 py-2 text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98] sm:inline-block">{t.nav.cta}</a>
            <button type="button" className="rounded-lg p-2 text-ink md:hidden" aria-expanded={menuOpen} aria-label={menuOpen ? t.nav.close : t.nav.menu}
              onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X size={24} aria-hidden="true" /> : <List size={24} aria-hidden="true" />}
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-black/10 bg-surface/95 p-4 shadow-lg backdrop-blur-md md:hidden">
            <ul className="flex flex-col gap-2">
              {navLinks.map((l, i) => (
                <li key={l.href} style={{ transitionDelay: `${i * 60}ms` }} className="animate-[menuIn_0.4s_cubic-bezier(0.22,1,0.36,1)_both]">
                  <a href={l.href} onClick={() => setMenuOpen(false)} className="title-2 block rounded-lg px-3 py-2 hover:bg-soft">{l.label}</a>
                </li>
              ))}
              <li><a href="#trial" onClick={() => setMenuOpen(false)} className="button-md mt-2 block rounded-lg bg-accent px-3 py-2 text-center text-white">{t.nav.cta}</a></li>
            </ul>
          </div>
        )}
      </header>

      <main id="main">
        <section id="top" className="px-4 pb-16 pt-32 sm:pt-40">
          <div className="mx-auto max-w-6xl text-center">
            <p className="caption-1 mx-auto inline-block rounded-full border border-black/10 bg-soft px-4 py-2">{t.hero.badge}</p>
            <h1 className="heading-1 hero-gradient mx-auto mt-8 max-w-[680px]">{t.hero.title}</h1>
            <p className="body-2 mx-auto mt-8 max-w-[680px] text-mute">{t.hero.subtitle}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="#trial" className="button-md rounded-lg bg-accent px-3 py-2 text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98]">{t.hero.cta}</a>
              <a href="#how" className="button-md rounded-lg border border-black/10 px-3 py-2 transition-all duration-300 hover:bg-soft active:scale-[0.98]">{t.hero.secondary}</a>
            </div>
            <p className="caption-2 mt-8 text-mute">{t.hero.proof}</p>
            <Reveal className="mx-auto mt-8 max-w-3xl">
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-surface text-start shadow-lg">
                <div className="flex items-center justify-between border-b border-black/10 px-4 py-2">
                  <p className="title-3">{t.hero.mockTitle}</p>
                  <span className="caption-3 rounded-full bg-soft px-2 py-1">{t.misc.demo}</span>
                </div>
                <div className="flex gap-2 px-4 pt-4" role="tablist" aria-label={t.hero.mockTitle}>
                  {[t.mock.tab1, t.mock.tab2].map((label, i) => (
                    <button key={label} type="button" role="tab" aria-selected={mockTab === i} onClick={() => setMockTab(i)}
                      className={`button-sm rounded-lg px-3 py-2 transition-colors duration-300 ${mockTab === i ? 'bg-accent text-white' : 'bg-soft text-mute hover:text-ink'}`}>{label}</button>
                  ))}
                </div>
                <ul className="space-y-4 p-4">
                  {mockMsgs.map((m: Dict['mock']['msgs'][number], i: number) => (
                    <li key={i} className={`flex ${m.who === 'ai' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${m.who === 'ai' ? 'bg-accent text-white' : 'bg-soft'}`}>
                        <p className="body-3">{m.text}</p>
                      </div>
                    </li>
                  ))}
                  <li className="flex items-center gap-2 px-2 text-mute">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
                    <span className="caption-2">{t.mock.typing}</span>
                  </li>
                </ul>
                <p className="caption-2 border-t border-black/10 px-4 py-2 text-mute">{t.hero.mockCaption}</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16" aria-labelledby="problem-title">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 id="problem-title" className="heading-3">{t.problem.title}</h2>
            <p className="body-2 mt-4 text-mute">{t.problem.text}</p>
          </Reveal>
        </section>

        <section id="features" className="px-4 py-16" aria-labelledby="benefits-title">
          <div className="mx-auto max-w-6xl">
            <Reveal className="text-center">
              <h2 id="benefits-title" className="heading-3">{t.benefits.title}</h2>
              <p className="body-2 mx-auto mt-4 max-w-[680px] text-mute">{t.benefits.subtitle}</p>
            </Reveal>
            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {t.benefits.items.map((b: Dict['benefits']['items'][number], i: number) => {
                const Icon = BENEFIT_ICONS[i]
                return (
                  <Reveal key={b.title}>
                    <article className="h-full rounded-2xl border border-black/10 bg-surface p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-soft text-accent"><Icon size={24} aria-hidden="true" /></span>
                      <h3 className="heading-6 mt-4">{b.title}</h3>
                      <p className="body-3 mt-2 text-mute">{b.text}</p>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-16" aria-label="Tagline">
          <TaglineReveal text={t.tagline} />
        </section>

        <section id="how" className="px-4 py-16" aria-labelledby="steps-title">
          <div className="mx-auto max-w-6xl">
            <Reveal className="text-center">
              <h2 id="steps-title" className="heading-3">{t.steps.title}</h2>
              <p className="body-2 mx-auto mt-4 max-w-[680px] text-mute">{t.steps.subtitle}</p>
            </Reveal>
            <ol className="mt-12 grid gap-8 md:grid-cols-3">
              {t.steps.items.map((s: Dict['steps']['items'][number], i: number) => {
                const Icon = STEP_ICONS[i]
                return (
                  <Reveal key={s.title}>
                    <li className="rounded-2xl border border-black/10 bg-surface p-8">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white"><Icon size={24} aria-hidden="true" /></span>
                      <p className="caption-1 mt-4 text-accent">{String(i + 1).padStart(2, '0')}</p>
                      <h3 className="heading-6 mt-2">{s.title}</h3>
                      <p className="body-3 mt-2 text-mute">{s.text}</p>
                    </li>
                  </Reveal>
                )
              })}
            </ol>
          </div>
        </section>

        <section className="px-4 py-16" aria-labelledby="social-title">
          <div className="mx-auto max-w-6xl">
            <Reveal className="text-center">
              <h2 id="social-title" className="heading-3">{t.social.title}</h2>
              <p className="body-2 mx-auto mt-4 max-w-[680px] text-mute">{t.social.subtitle}</p>
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {t.social.items.map((s: Dict['social']['items'][number]) => (
                <Reveal key={s.name}>
                  <figure className="h-full rounded-2xl border border-black/10 bg-surface p-8">
                    <span className="caption-3 rounded-full bg-soft px-2 py-1 text-accent">{t.social.label}</span>
                    <blockquote className="body-2 mt-4">{s.quote}</blockquote>
                    <figcaption className="mt-4">
                      <p className="title-4">{s.name}</p>
                      <p className="caption-2 text-mute">{s.role}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-16" aria-labelledby="pricing-title">
          <div className="mx-auto max-w-6xl">
            <Reveal className="text-center">
              <h2 id="pricing-title" className="heading-3">{t.pricing.title}</h2>
              <p className="body-2 mx-auto mt-4 max-w-[680px] text-mute">{t.pricing.subtitle}</p>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/10 p-1" role="group" aria-label="Billing period">
                <button type="button" onClick={() => setYearly(false)} aria-pressed={!yearly} className={`button-sm rounded-full px-3 py-2 transition-colors duration-300 ${!yearly ? 'bg-accent text-white' : 'text-mute'}`}>{t.pricing.monthly}</button>
                <button type="button" onClick={() => setYearly(true)} aria-pressed={yearly} className={`button-sm rounded-full px-3 py-2 transition-colors duration-300 ${yearly ? 'bg-accent text-white' : 'text-mute'}`}>{t.pricing.yearly}</button>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {t.pricing.tiers.map((tier: Dict['pricing']['tiers'][number], i: number) => (
                <Reveal key={tier.name}>
                  <article className={`relative h-full rounded-2xl border p-8 ${i === 1 ? 'border-accent bg-surface shadow-lg' : 'border-black/10 bg-surface'}`}>
                    {i === 1 && <span className="caption-3 absolute -top-4 start-8 rounded-full bg-accent px-3 py-1 text-white">{t.pricing.popular}</span>}
                    <h3 className="heading-5">{tier.name}</h3>
                    <p className="body-3 mt-2 text-mute">{tier.desc}</p>
                    <p className="mt-4"><span className="heading-4">{tier.price}</span> <span className="caption-2 text-mute">{yearly ? t.pricing.yearly : tier.period}</span></p>
                    <ul className="mt-4 space-y-2">
                      {tier.features.map((f: string) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                          <span className="body-3">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#trial" className={`button-md mt-8 block rounded-lg px-3 py-2 text-center transition-all duration-300 active:scale-[0.98] ${i === 1 ? 'bg-accent text-white hover:opacity-90' : 'border border-black/10 hover:bg-soft'}`}>{tier.cta}</a>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="caption-2 mt-8 text-center text-mute">{t.pricing.note}</p>
          </div>
        </section>

        <section id="faq" className="px-4 py-16" aria-labelledby="faq-title">
          <div className="mx-auto max-w-3xl">
            <Reveal className="text-center">
              <h2 id="faq-title" className="heading-3">{t.faq.title}</h2>
            </Reveal>
            <div className="mt-12 space-y-4">
              {t.faq.items.map((item: Dict['faq']['items'][number], i: number) => (
                <Reveal key={item.q}>
                  <div className="rounded-2xl border border-black/10 bg-surface">
                    <button type="button" aria-expanded={faqOpen === i} onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-8 py-4 text-start">
                      <span className="title-2">{item.q}</span>
                      <span className={`shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${faqOpen === i ? 'rotate-180' : ''}`} aria-hidden="true">⌄</span>
                    </button>
                    {faqOpen === i && <p className="body-3 px-8 pb-4 text-mute">{item.a}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="trial" className="px-4 py-16" aria-labelledby="final-title">
          <Reveal className="mx-auto max-w-3xl rounded-2xl bg-accent p-8 text-center text-white sm:p-12">
            <h2 id="final-title" className="heading-3">{t.final.title}</h2>
            <p className="body-2 mt-4">{t.final.text}</p>
            {emailDone ? (
              <p role="status" className="body-2 mt-8 flex items-center justify-center gap-2">
                <CheckCircle size={20} aria-hidden="true" /> {t.form.success}
              </p>
            ) : (
              <form onSubmit={submitEmail} noValidate className="mx-auto mt-8 flex max-w-md flex-col gap-4 sm:flex-row">
                <label htmlFor="trial-email" className="sr-only">{t.form.label}</label>
                <input id="trial-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.form.placeholder} aria-invalid={emailError !== ''} aria-describedby={emailError ? 'trial-error' : undefined}
                  className="body-3 min-w-0 flex-1 rounded-lg border border-white/40 bg-white px-4 py-2 text-ink placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-white" />
                <button type="submit" disabled={emailBusy} className="button-md shrink-0 rounded-lg bg-ink px-3 py-2 text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
                  {emailBusy ? '…' : t.form.button}
                </button>
              </form>
            )}
            {emailBusy && <div className="mx-auto mt-4 h-4 w-48 animate-pulse rounded bg-white/40" aria-hidden="true" />}
            {emailError && <p id="trial-error" role="alert" className="body-3 mt-4 text-white underline">{emailError}</p>}
            <p className="caption-2 mt-4 text-white/80">{t.final.note} {t.form.privacyNote}</p>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-black/10 px-4 py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="title-1 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-lg font-bold text-white">{BRAND.charAt(0)}</span>
              {BRAND}
            </p>
            <p className="body-3 mt-4 max-w-xs text-mute">{t.footer.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <li key={l.href}><a href={l.href} className="title-4 text-mute transition-colors duration-300 hover:text-ink">{l.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => setLegal('privacy')} className="title-4 text-start text-mute transition-colors duration-300 hover:text-ink">{t.footer.privacy}</button>
            <button type="button" onClick={() => setLegal('terms')} className="title-4 text-start text-mute transition-colors duration-300 hover:text-ink">{t.footer.terms}</button>
            <a href="#top" className="title-4 flex items-center gap-2 text-mute transition-colors duration-300 hover:text-ink">
              <ArrowUp size={16} aria-hidden="true" /> {t.misc.backTop}
            </a>
          </div>
        </div>
        <p className="caption-2 mx-auto mt-12 max-w-6xl text-mute">© 2026 {BRAND}. {t.footer.rights}</p>
      </footer>

      {cookie === null && (
        <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-2xl border border-black/10 bg-surface p-4 shadow-lg">
          <p className="body-3">{t.cookie.text}</p>
          <div className="mt-4 flex gap-4">
            <button type="button" onClick={() => setCookieChoice('accepted')} className="button-sm rounded-lg bg-accent px-3 py-2 text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98]">{t.cookie.accept}</button>
            <button type="button" onClick={() => setCookieChoice('declined')} className="button-sm rounded-lg border border-black/10 px-3 py-2 transition-all duration-300 hover:bg-soft active:scale-[0.98]">{t.cookie.decline}</button>
          </div>
        </div>
      )}

      {legal && (
        <div role="dialog" aria-modal="true" aria-label={legal === 'privacy' ? t.footer.privacy : t.footer.terms}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setLegal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-surface p-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="heading-5">{legal === 'privacy' ? t.footer.privacy : t.footer.terms}</h2>
            <p className="body-3 mt-4 text-mute">{legal === 'privacy' ? t.footer.privacyText : t.footer.termsText}</p>
            <button type="button" onClick={() => setLegal(null)} className="button-md mt-8 rounded-lg bg-accent px-3 py-2 text-white transition-all duration-300 hover:opacity-90 active:scale-[0.98]">{t.nav.close}</button>
          </div>
        </div>
      )}
    </div>
  )
}
