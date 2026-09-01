'use client'
// GERADO por scripts/port-app.mjs a partir de _gerador/tpl/App.jsx — não editar à mão.
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import RodapeZonas from './RodapeZonas'
import {
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { useSite, SiteProvider } from './SiteContext'

// O GSAP e o ScrollTrigger só animam secções abaixo da primeira dobra: a
// página desenha-se inteira sem eles. No pacote inicial eram ~50 kB a disputar
// a rede com a imagem do herói, que é a que decide o LCP — por isso passam a
// ser pedidos só depois do `load`, quando o herói já apareceu. A promessa fica
// guardada: os três sítios que animam partilham o mesmo pedido.
let promessaGsap
const carregarGsap = () => (promessaGsap ??= Promise
  .all([import('gsap'), import('gsap/ScrollTrigger')])
  .then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger)
    return { gsap, ScrollTrigger }
  }))

// Devolve como se desfaz a espera, para o efeito não deixar ouvintes para trás.
const depoisDoLoad = (fn) => {
  if (document.readyState === 'complete') { fn(); return () => {} }
  window.addEventListener('load', fn, { once: true })
  return () => window.removeEventListener('load', fn)
}

// Esperar pelo `load`, pedir o GSAP, montar o contexto quando ele chegar e
// desfazê-lo ao sair — mesmo que a saída aconteça antes de qualquer uma dessas
// coisas responder. Sem o `saiu`, uma navegação rápida deixava uma animação
// presa a elementos que já não existem.
function useAnimacao(montar, ref) {
  useEffect(() => {
    if (prefersReducedMotion) return
    let ctx
    let saiu = false
    const parar = depoisDoLoad(() => {
      carregarGsap().then(({ gsap }) => {
        if (saiu) return
        ctx = gsap.context(() => montar(gsap), ref)
      })
    })
    return () => { saiu = true; parar(); ctx?.revert() }
  }, [])
}

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ----------------------------------------------------------------
   Utilitários
---------------------------------------------------------------- */
function CountUp({ end, suffix = '', duration = 2000, decimals = 0 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTs = performance.now()
          const tick = (now) => {
            const t = Math.min(1, (now - startTs) / duration)
            const eased = 1 - Math.pow(1 - t, 3)
            setValue(end * eased)
            if (t < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  const shown = decimals
    ? value.toFixed(decimals).replace('.', ',')
    : Math.round(value)

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix}
    </span>
  )
}

/* ----------------------------------------------------------------
   Badge de avaliação Google
---------------------------------------------------------------- */
const STAR_PATH =
  'M11.7926 19.0032C11.9201 18.9258 12.0799 18.9259 12.2074 19.0032L17.9862 22.5077C18.289 22.6913 18.6634 22.4201 18.5833 22.0752L17.0484 15.4643C17.0149 15.3201 17.0638 15.1693 17.1754 15.0721L22.2877 10.6222C22.5542 10.3902 22.411 9.9519 22.059 9.92189L15.3317 9.34841C15.1837 9.3358 15.0548 9.24219 14.9971 9.10532L12.3686 2.87374C12.231 2.54768 11.769 2.54769 11.6314 2.87374L9.00288 9.10532C8.94515 9.24219 8.81632 9.3358 8.66831 9.34841L1.94098 9.92189C1.58896 9.9519 1.44585 10.3902 1.71234 10.6222L6.82459 15.0721C6.93622 15.1693 6.98508 15.3201 6.95161 15.4643L5.41671 22.0752C5.33664 22.4201 5.71105 22.6913 6.01376 22.5077L11.7926 19.0032Z'

function RatingStar({ fill = 1 }) {
  if (fill >= 1) {
    return (
      <svg viewBox="0 0 24 25" fill="none" aria-hidden="true">
        <path d={STAR_PATH} fill="#ffb542" />
      </svg>
    )
  }
  if (fill <= 0) {
    return (
      <svg viewBox="0 0 24 25" fill="none" aria-hidden="true">
        <path d={STAR_PATH} fill="#e2e8f0" />
      </svg>
    )
  }
  const clipId = `esu-star-clip-${Math.round(fill * 100)}`
  return (
    <svg viewBox="0 0 24 25" fill="none" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={24 * fill} height="25" />
        </clipPath>
      </defs>
      <path d={STAR_PATH} fill="#e2e8f0" />
      <path d={STAR_PATH} fill="#ffb542" clipPath={`url(#${clipId})`} />
    </svg>
  )
}

function GoogleLogo({ className = 'esu-badge__logo' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <g clipPath="url(#google-logo)">
        <path
          d="M3.54594 9.66899L2.989 11.7481L0.953406 11.7912C0.345063 10.6628 0 9.37186 0 7.99999C0 6.67339 0.322625 5.42239 0.8945 4.32086H0.894937L2.70719 4.65311L3.50106 6.45449C3.33491 6.93889 3.24434 7.45889 3.24434 7.99999C3.24441 8.58724 3.35078 9.14989 3.54594 9.66899Z"
          fill="#FBBB00"
        />
        <path
          d="M15.8602 6.50552C15.9521 6.98946 16 7.48924 16 8.00002C16 8.57277 15.9398 9.13146 15.8251 9.67037C15.4357 11.5042 14.4181 13.1055 13.0084 14.2387L13.008 14.2383L10.7253 14.1218L10.4023 12.1051C11.3377 11.5565 12.0687 10.6981 12.4537 9.67037H8.1759V6.50552H12.5161H15.8602Z"
          fill="#518EF8"
        />
        <path
          d="M13.008 14.2382L13.0084 14.2387C11.6375 15.3406 9.8959 16 8.00009 16C4.95349 16 2.30471 14.2971 0.953491 11.7912L3.54602 9.66901C4.22162 11.4721 5.96096 12.7556 8.00009 12.7556C8.87655 12.7556 9.69768 12.5187 10.4023 12.105L13.008 14.2382Z"
          fill="#28B446"
        />
        <path
          d="M13.1064 1.84175L10.5147 3.9635C9.7855 3.50769 8.9235 3.24437 8 3.24437C5.91472 3.24437 4.14284 4.58678 3.50109 6.4545L0.894938 4.32087H0.894501C2.22594 1.75384 4.90813 0 8 0C9.94109 0 11.7209 0.691437 13.1064 1.84175Z"
          fill="#F14336"
        />
      </g>
      <defs>
        <clipPath id="google-logo">
          <rect width="16" height="16" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  )
}

const REVIEW_AVATARS = [
  '/avatars/avatar1.webp',
  '/avatars/avatar2.webp',
  '/avatars/avatar3.webp',
]

function ratingLabel(r) {
  if (r >= 4.7) return 'Excelente'
  if (r >= 4.3) return 'Muito bom'
  if (r >= 3.8) return 'Bom'
  return 'Avaliado'
}

function GoogleRatingBadge({ className = '' }) {
  const { BRAND } = useSite()
  const rating = BRAND.ratingValue
  // Sem nota no Google não há distintivo. Com `nota` nula saía "/5", cinco
  // estrelas apagadas e "· 0 avaliações" — o visitante lia uma casa avaliada
  // em nada, quando o que não existe é o dado.
  if (!rating) return null
  // As caras de quem avaliou de verdade, quando as há. Os três ficheiros de
  // fallback são genéricos: ao lado de "73 avaliações" davam a entender que
  // eram aquelas pessoas.
  const avatars = BRAND.avatars?.length ? BRAND.avatars : REVIEW_AVATARS

  return (
    <a
      href={BRAND.maps}
      target="_blank"
      rel="noopener nofollow"
      aria-label={`${BRAND.rating} em 5 no Google, ${BRAND.reviews} avaliações — abrir no Google Maps`}
      className={`esu-badge ${className}`}
    >
      <GoogleLogo />

      <span className="esu-badge__main">
        <span className="esu-badge__value">{BRAND.rating}/5</span>
        <span className="esu-badge__stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <RatingStar key={i} fill={Math.max(0, Math.min(1, rating - i))} />
          ))}
        </span>
        <span className="esu-badge__label">{ratingLabel(rating)}</span>
        <span className="esu-badge__count">· {BRAND.reviews} avaliações</span>
      </span>

      <span className="esu-badge__avatars">
        {/* Decoração de 28 px: nunca à frente do herói. Os avatares reais vêm
            do `lh3.googleusercontent.com`, e sem isto o React pré-carregava
            três deles no `<head>` — uma ligação nova a um domínio de fora a
            disputar largura de banda com a maior imagem da página, que é a que
            decide o LCP. A ninguém falta um rosto de 28 px meio segundo. */}
        {avatars.map((src) => (
          <img
            key={src}
            className="esu-badge__avatar"
            src={src}
            alt="Foto de perfil de quem avaliou no Google"
            width="28"
            height="28"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
          />
        ))}
        {BRAND.reviews > avatars.length ? (
          <span className="esu-badge__avatar esu-badge__more">
            <span>+{BRAND.reviews - avatars.length}</span>
          </span>
        ) : null}
      </span>
    </a>
  )
}

/* ----------------------------------------------------------------
   Marca — cabeçalho, menu e rodapé
---------------------------------------------------------------- */
// Com logótipo do negócio mostra-se a imagem; sem ele, o ícone do nicho dentro
// do círculo da cor primária. Um negócio que já tem marca própria não quer ver
// um símbolo genérico no cimo do site dele.
//
// O `dim` é a medida do ícone do nicho: um quadrado ao lado do nome escrito.
// Um logótipo do negócio não cabe lá — é largo, traz o nome lá dentro, e à
// altura do ícone o nome dentro dele fica com uns dez pixéis e não se lê.
//
// Por isso tem medida própria e mais alta, que é o espaço que o nome escrito
// deixou de ocupar ao lado. A largura vem da forma do ficheiro; o `max-w` só
// trava um logótipo muito comprido antes de ele empurrar o menu.
export function Marca({ dim = 'h-9 w-9', logoDim = 'h-14 sm:h-16', ring = false }) {
  const { BRAND, LogoIcon } = useSite()
  if (BRAND.logo) {
    return (
      <span className={`relative flex ${logoDim} items-center shrink-0`}>
        <img src={BRAND.logo} alt={BRAND.name} className="h-full w-auto max-w-[15rem] object-contain" />
      </span>
    )
  }
  return (
    <span className={`relative flex ${dim} items-center justify-center rounded-full bg-primary`}>
      <LogoIcon className="h-5 w-5 text-white" strokeWidth={2.4} />
      {ring ? (
        <span className="absolute inset-0 rounded-full ring-2 ring-primary/30 group-hover:ring-primary/50 transition" />
      ) : null}
    </span>
  )
}

/* ----------------------------------------------------------------
   1. Navbar
---------------------------------------------------------------- */
export function Navbar() {
  const { BRAND, NAV_LINKS, COPY, SERVICO, basePath } = useSite()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl rounded-full px-4 sm:px-6 py-2.5 transition-all duration-500 ${
          scrolled ? 'glass shadow-lg shadow-ink/5' : 'bg-transparent'
        }`}
      >
        <nav className="flex items-center justify-between gap-4">
          <a href={`${basePath}/#inicio`} className="flex items-center gap-2 group shrink-0">
            <Marca ring />
            {/* Sem o nome quando o logótipo já o traz: escrito ao lado ficava o
                nome do negócio duas vezes, uma delas em corpo maior que a marca. */}
            <span
              className={`font-display font-bold tracking-tight text-lg transition-colors ${
                BRAND.logo ? 'sr-only' : ''
              } ${scrolled ? 'text-ink' : 'text-white'}`}
            >
              {BRAND.short}
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href.startsWith('#') ? `${basePath}/${l.href}` : l.href}
                className={`font-body text-sm transition-colors ${
                  scrolled ? 'text-muted hover:text-ink' : 'text-white/75 hover:text-white'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`${basePath}/#contactos`}
              className="magnetic-btn hidden sm:inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg shadow-primary/25"
            >
              {COPY.navCta}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              className={`lg:hidden flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                scrolled ? 'border-divider text-ink' : 'border-white/25 text-white'
              }`}
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-deep/95 backdrop-blur-2xl transition-all duration-500 lg:hidden ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-7">
          <span className="flex items-center gap-2 text-white">
            <Marca />
            <span className={`font-display font-bold text-lg ${BRAND.logo ? 'sr-only' : ''}`}>
              {BRAND.short}
            </span>
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-16 px-8 flex flex-col gap-6">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href.startsWith('#') ? `${basePath}/${l.href}` : l.href}
              onClick={() => setOpen(false)}
              className="font-display text-4xl font-bold text-white/90 hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`tel:${BRAND.phoneTel}`}
            onClick={() => registarClique('cta_click', SERVICO)}
            className="mt-8 inline-flex items-center gap-2 self-start bg-primary text-white px-6 py-3 rounded-full font-semibold"
          >
            <Phone className="h-4 w-4" /> {BRAND.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  )
}

/* ----------------------------------------------------------------
   2. Hero
---------------------------------------------------------------- */
// O primeiro ecrã não tem animação de entrada nenhuma: o `gsap.from` apagava
// manchete, botões e telefone depois de o HTML já os ter desenhado, e só os
// trazia de volta um segundo mais tarde. Quem chega ao site via um ecrã em
// branco durante esse tempo, e é o pior sítio possível para o fazer.
function Hero() {
  const { BRAND, HERO, COPY, SERVICO, basePath } = useSite()
  const Particle = HERO.ParticleIcon

  return (
    <section id="inicio" className="relative min-h-[100dvh] overflow-hidden bg-deep">
      {/* A maior imagem da página e quase sempre o elemento de LCP: nunca lazy,
          e com prioridade para começar a descarregar antes do resto. */}
      <img
        src={HERO.image}
        srcSet={conjunto(HERO.image, [640, 960, 1280, 1920, 2560])}
        sizes="100vw"
        alt={HERO.alt}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.45]"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-deep/85 via-deep/45 to-deep/75" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-deep to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="absolute top-28 right-6 sm:right-16 z-10 hidden sm:block">
        {[0, 1, 2, 3, 4].map((i) => (
          <Particle
            key={i}
            className="absolute text-accent/50 animate-float"
            style={{
              left: `${i * 34}px`,
              top: `${(i % 3) * 46}px`,
              width: `${12 + (i % 3) * 6}px`,
              height: `${12 + (i % 3) * 6}px`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-32 pb-20 min-h-[100dvh] flex flex-col justify-end">
        <p className="hero-meta font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 mb-5">
          {HERO.eyebrow}
        </p>

        {BRAND.ratingValue ? (
          <div className="hero-meta mb-8">
            <GoogleRatingBadge />
          </div>
        ) : null}

        <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-[0.95] max-w-5xl">
          <span className="block">{HERO.line1}</span>
          <span className="block font-serif italic font-medium text-primary-light">
            {HERO.line2}
          </span>
        </h1>

        <p className="hero-meta mt-8 max-w-xl text-white/70 text-base sm:text-lg leading-relaxed">
          {HERO.sub}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={`${basePath}/#contactos`}
            className="magnetic-btn inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/30"
          >
            {COPY.heroCta} <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={`tel:${BRAND.phoneTel}`}
            onClick={() => registarClique('cta_click', SERVICO)}
            className="magnetic-btn inline-flex items-center gap-2 glass-dark text-white px-6 py-3 rounded-full font-semibold border border-white/15"
          >
            <Phone className="h-4 w-4" /> {BRAND.phoneDisplay}
          </a>
        </div>

        {/* O custo da chamada acompanha o número onde quer que ele apareça. */}
        {BRAND.phoneNote ? (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            {BRAND.phoneNote}
          </p>
        ) : null}

        <div className="hero-meta mt-14 flex items-center gap-3 text-white/50">
          <span className="h-10 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Deslizar</span>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Cartão 1 — Baralhador
---------------------------------------------------------------- */
function Shuffler() {
  const { SHUFFLER } = useSite()
  const [stack, setStack] = useState(SHUFFLER.items)

  useEffect(() => {
    const interval = setInterval(() => {
      setStack((prev) => {
        const next = [...prev]
        next.unshift(next.pop())
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-44 w-full">
      {stack.map((item, offset) => (
        <div
          key={item.tag}
          style={{
            transform: `translate(${offset * 14}px, ${offset * 14}px) scale(${1 - offset * 0.05})`,
            zIndex: stack.length - offset,
            opacity: 1 - offset * 0.25,
            transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease',
          }}
          className="absolute inset-0 bg-white border border-divider rounded-3xl p-5 shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary-dark bg-primary/10 px-2 py-1 rounded-full">
              {item.tag}
            </span>
            <span className="font-mono text-xs text-muted">{item.meta}</span>
          </div>
          <div className="mt-4 font-display text-lg font-semibold text-ink leading-tight">
            {item.label}
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {Array.from({ length: 24 }).map((_, idx) => (
              <span
                key={idx}
                className="h-1 w-1 rounded-full"
                style={{
                  background: idx < 24 - offset * 6 ? 'rgb(var(--primary))' : '#E0E0E0',
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ----------------------------------------------------------------
   Cartão 2 — Animação assinatura (re-skin por nicho)
---------------------------------------------------------------- */
// O fundo da animação: o degradé da paleta ativa assente numa base branca, para
// ficar opaco como o hexadecimal fixo que substituiu. A forma da animação
// continua a vir do tema; só a cor deixou de estar presa ao nicho.
const FUNDO_ASSINATURA = [
  'linear-gradient(180deg, rgb(var(--primary-light) / .18) 0%,',
  'rgb(var(--primary-light) / .42) 65%, rgb(var(--primary-light) / .66) 100%),',
  '#FFFFFF',
].join(' ')

function SignatureSource({ kind, color }) {
  if (kind === 'grille') {
    return (
      <>
        <rect x="0" y="3" width="400" height="14" rx="4" fill={color} fillOpacity="0.16" />
        <rect x="0" y="3" width="400" height="14" rx="4" fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1" />
        {[6, 10, 14].map((y) => (
          <rect key={y} x="10" y={y - 1} width="380" height="2" rx="1" fill={color} fillOpacity="0.45" />
        ))}
        <rect x="0" y="1" width="7" height="18" rx="2" fill={color} fillOpacity="0.5" />
        <rect x="393" y="1" width="7" height="18" rx="2" fill={color} fillOpacity="0.5" />
      </>
    )
  }
  if (kind === 'beam') {
    return (
      <>
        <rect x="0" y="2" width="400" height="4" rx="1" fill={color} fillOpacity="0.45" />
        <rect x="0" y="14" width="400" height="4" rx="1" fill={color} fillOpacity="0.45" />
        <rect x="196" y="5" width="8" height="10" fill={color} fillOpacity="0.3" />
        {[40, 120, 200, 280, 360].map((x) => (
          <rect key={x} x={x - 2} y="5" width="4" height="10" fill={color} fillOpacity="0.22" />
        ))}
      </>
    )
  }
  if (kind === 'rail') {
    return (
      <>
        <rect x="0" y="7" width="400" height="6" rx="3" fill={color} fillOpacity="0.3" />
        {[50, 130, 210, 290, 370].map((x) => (
          <g key={x}>
            <circle cx={x} cy="10" r="4.5" fill={color} fillOpacity="0.55" />
            <circle cx={x} cy="10" r="2" fill="#fff" fillOpacity="0.75" />
          </g>
        ))}
      </>
    )
  }
  if (kind === 'branch') {
    return (
      <>
        <path
          d="M0 12 Q 100 4, 200 11 T 400 8"
          fill="none"
          stroke={color}
          strokeOpacity="0.55"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {[70, 160, 250, 330].map((x) => (
          <circle key={x} cx={x} cy="10" r="3" fill={color} fillOpacity="0.5" />
        ))}
      </>
    )
  }
  // 'pipe' (predefinição)
  return (
    <>
      <rect x="0" y="6" width="400" height="8" rx="4" fill={color} fillOpacity="0.25" />
      <rect x="0" y="7" width="400" height="2" fill={color} fillOpacity="0.4" />
      <rect x="0" y="4" width="6" height="12" rx="1.5" fill={color} fillOpacity="0.5" />
      <rect x="394" y="4" width="6" height="12" rx="1.5" fill={color} fillOpacity="0.5" />
      {[60, 152, 248, 340].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="2" width="6" height="6" rx="1" fill={color} />
          <rect x={x - 4} y="13" width="8" height="3" rx="1" fill={color} fillOpacity="0.7" />
        </g>
      ))}
    </>
  )
}

function SignatureSurface({ kind, color }) {
  if (kind === 'ticks') {
    return (
      <>
        <line x1="0" y1="8" x2="200" y2="8" stroke={color} strokeOpacity="0.4" strokeWidth="1" />
        {Array.from({ length: 21 }).map((_, i) => (
          <line
            key={i}
            x1={i * 10}
            y1={i % 5 === 0 ? 2 : 5}
            x2={i * 10}
            y2="8"
            stroke={color}
            strokeOpacity={i % 5 === 0 ? 0.5 : 0.25}
            strokeWidth="1"
          />
        ))}
      </>
    )
  }
  if (kind === 'grid') {
    return (
      <>
        <line x1="0" y1="7" x2="200" y2="7" stroke={color} strokeOpacity="0.45" strokeWidth="1.2" />
        {Array.from({ length: 11 }).map((_, i) => (
          <rect
            key={i}
            x={i * 20}
            y="8"
            width="10"
            height="4"
            fill={color}
            fillOpacity="0.18"
          />
        ))}
      </>
    )
  }
  if (kind === 'line') {
    return (
      <>
        <line x1="0" y1="7" x2="200" y2="7" stroke={color} strokeOpacity="0.5" strokeWidth="1.4" />
        <line x1="0" y1="10" x2="200" y2="10" stroke={color} strokeOpacity="0.2" strokeWidth="1" />
      </>
    )
  }
  // 'wave'
  return (
    <>
      <path
        d="M 0,6 Q 12.5,2 25,6 T 50,6 T 75,6 T 100,6 T 125,6 T 150,6 T 175,6 T 200,6"
        fill="none"
        stroke={color}
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <path
        d="M 0,8 Q 12.5,5 25,8 T 50,8 T 75,8 T 100,8 T 125,8 T 150,8 T 175,8 T 200,8"
        fill="none"
        stroke={color}
        strokeOpacity="0.25"
        strokeWidth="0.8"
      />
    </>
  )
}

const PARTICLES = [
  { left: '15%', delay: '0.0s', dur: '2.6s', size: 16 },
  { left: '25%', delay: '1.3s', dur: '3.0s', size: 12 },
  { left: '38%', delay: '0.6s', dur: '2.8s', size: 18 },
  { left: '50%', delay: '1.8s', dur: '2.4s', size: 13 },
  { left: '62%', delay: '0.9s', dur: '3.1s', size: 17 },
  { left: '74%', delay: '2.0s', dur: '2.7s', size: 12 },
  { left: '85%', delay: '0.4s', dur: '2.9s', size: 15 },
]

const RIPPLES = [
  { left: '22%', delay: '0.2s' },
  { left: '48%', delay: '1.0s' },
  { left: '76%', delay: '1.8s' },
]

function SignatureAnim() {
  const { SIGNATURE } = useSite()
  const [statusIdx, setStatusIdx] = useState(0)
  const [count, setCount] = useState(SIGNATURE.header.value)
  const statuses = SIGNATURE.statuses

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx((idx) => {
        const next = (idx + 1) % statuses.length
        if (next === statuses.length - 1 && SIGNATURE.header.increment) {
          setCount((c) => c + 1)
        }
        return next
      })
    }, 2300)
    return () => clearInterval(interval)
  }, [statuses.length])

  const status = statuses[statusIdx]
  const toneText =
    status.tone === 'emerald'
      ? 'text-emerald-600'
      : status.tone === 'accent'
      ? 'text-accent-dark'
      : 'text-primary-dark'
  const toneDot =
    status.tone === 'emerald'
      ? 'bg-emerald-500'
      : status.tone === 'accent'
      ? 'bg-accent'
      : 'bg-primary'

  const p = SIGNATURE.particle
  const HeaderIcon = SIGNATURE.header.Icon

  return (
    <div
      className="relative h-44 w-full rounded-3xl overflow-hidden"
      style={{ background: FUNDO_ASSINATURA, border: '1px solid rgb(var(--primary-dark) / .2)' }}
    >
      <div className="absolute -top-8 -left-6 h-20 w-32 rounded-full bg-white/70 blur-2xl" />
      <div className="absolute top-2 right-10 h-14 w-24 rounded-full bg-white/60 blur-xl" />

      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <HeaderIcon className="h-3.5 w-3.5" style={{ color: 'rgb(var(--primary-dark))' }} strokeWidth={2.2} />
          <span
            className="font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'rgb(var(--primary-dark))' }}
          >
            {SIGNATURE.header.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-bold text-sm text-ink tabular-nums">
            {SIGNATURE.header.pad ? String(count).padStart(2, '0') : count}
          </span>
          <span className="font-mono text-[9px] uppercase tracking-widest text-muted">
            {SIGNATURE.header.unit}
          </span>
        </div>
      </div>

      {/* A cor entra por `color` no <svg> e as formas usam `currentColor`:
          é o caminho que resolve em todos os browsers, ao contrário de um
          var() metido diretamente num atributo `fill`. */}
      <svg className="absolute left-3 right-3 top-9 h-5" viewBox="0 0 400 20" preserveAspectRatio="none"
           style={{ color: 'rgb(var(--primary-dark))' }}>
        <SignatureSource kind={SIGNATURE.source} color="currentColor" />
      </svg>

      <div className="absolute inset-x-0 top-14 bottom-11 overflow-hidden">
        {PARTICLES.map((d, i) => (
          <svg
            key={i}
            className="absolute top-0"
            style={{
              left: d.left,
              width: `${d.size}px`,
              height: `${Math.round(d.size * (p.ratio || 1))}px`,
              animation: `rain-fall ${d.dur} ${p.ease || 'cubic-bezier(0.45,0.05,0.55,0.95)'} ${d.delay} infinite`,
              filter: 'drop-shadow(0 1px 2px rgb(var(--primary-dark) / .33))',
              transform: 'translateX(-50%)',
            }}
            viewBox={p.viewBox}
          >
            <defs>
              <linearGradient id={`sig-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFFFFF' }} />
                <stop offset="55%" style={{ stopColor: 'rgb(var(--primary-light))' }} />
                <stop offset="100%" style={{ stopColor: 'rgb(var(--primary-dark))' }} />
              </linearGradient>
            </defs>
            {p.mode === 'stroke' ? (
              <g stroke={`url(#sig-${i})`} strokeWidth={p.strokeWidth || 2} strokeLinecap="round" fill="none">
                {p.paths.map((d2, k) => (
                  <path key={k} d={d2} />
                ))}
              </g>
            ) : (
              <g fill={`url(#sig-${i})`}>
                {p.paths.map((d2, k) => (
                  <path key={k} d={d2} />
                ))}
              </g>
            )}
            {p.highlight && (
              <ellipse cx={p.highlight[0]} cy={p.highlight[1]} rx={p.highlight[2]} ry={p.highlight[3]} fill="white" fillOpacity="0.55" />
            )}
          </svg>
        ))}
      </div>

      <svg className="absolute bottom-9 left-3 right-3 h-3" viewBox="0 0 200 12" preserveAspectRatio="none"
           style={{ color: 'rgb(var(--primary-dark))' }}>
        <SignatureSurface kind={SIGNATURE.surface} color="currentColor" />
      </svg>

      <div className="absolute bottom-[34px] left-3 right-3 h-2">
        {RIPPLES.map((r, i) => (
          <span
            key={i}
            className="absolute top-0 -translate-x-1/2 rounded-full"
            style={{
              left: r.left,
              width: '4px',
              height: '4px',
              border: '1px solid rgb(var(--primary-dark) / .47)',
              animation: `rain-ripple 2.4s ease-out ${r.delay} infinite`,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`relative h-2 w-2 rounded-full ${toneDot}`}>
            {status.tone === 'accent' && (
              <span className={`absolute inset-0 rounded-full ${toneDot} animate-ping`} />
            )}
          </span>
          <span
            key={status.text}
            className={`font-mono text-[10px] truncate ${toneText}`}
            style={{ animation: 'rain-fadein 0.35s ease-out' }}
          >
            {status.text}
          </span>
        </div>
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.2em] whitespace-nowrap pl-2 ${toneText}`}
        >
          {status.label}
        </span>
      </div>

      <style>{`
        @keyframes rain-fall {
          0%   { transform: translate(-50%, -10px) rotate(0deg); opacity: 0; }
          12%  { opacity: 1; }
          82%  { opacity: 1; }
          100% { transform: translate(-50%, 95px) rotate(${SIGNATURE.particle.rotate || 0}deg); opacity: 0; }
        }
        @keyframes rain-ripple {
          0%   { transform: translateX(-50%) scale(0.4); opacity: 0.9; }
          80%  { transform: translateX(-50%) scale(3.5); opacity: 0; }
          100% { transform: translateX(-50%) scale(3.5); opacity: 0; }
        }
        @keyframes rain-fadein {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

/* ----------------------------------------------------------------
   Cartão 3 — Agendamento com cursor
---------------------------------------------------------------- */
function VisitScheduler() {
  const { SCHEDULER } = useSite()
  const days = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']
  const [step, setStep] = useState(0)
  const activeDay = 2

  useEffect(() => {
    const interval = setInterval(() => setStep((p) => (p + 1) % 5), 1400)
    return () => clearInterval(interval)
  }, [])

  const cursorPos = (() => {
    switch (step) {
      case 0:
        return { x: 8, y: 110, opacity: 0 }
      case 1:
        return { x: 60, y: 60, opacity: 1 }
      case 2:
      case 3:
        return { x: 60 + activeDay * 36, y: 60, opacity: 1 }
      case 4:
        return { x: 130, y: 130, opacity: 1 }
      default:
        return { x: 8, y: 110, opacity: 0 }
    }
  })()

  return (
    <div className="relative h-44 w-full bg-white border border-divider rounded-3xl p-5 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {SCHEDULER.week}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-primary-dark bg-primary/10 px-2 py-0.5 rounded-full">
          {SCHEDULER.badge}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {days.map((d, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center h-9 rounded-xl text-xs font-medium transition-all duration-300 ${
              step >= 3 && idx === activeDay
                ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30'
                : 'bg-background text-ink'
            }`}
          >
            <span
              className={`font-mono text-[9px] ${
                step >= 3 && idx === activeDay ? 'text-white/80' : 'text-muted'
              }`}
            >
              {d}
            </span>
            <span className="font-display font-semibold text-sm">{idx + 7}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className={`w-full py-2.5 rounded-2xl font-medium text-xs transition-all duration-300 ${
          step === 4
            ? 'bg-accent text-white scale-[1.02] shadow-md shadow-accent/30'
            : 'bg-divider/40 text-muted'
        }`}
      >
        {step >= 3 ? `✓ ${SCHEDULER.confirmed}` : SCHEDULER.choose}
      </button>

      <div
        className="absolute pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          opacity: cursorPos.opacity,
          transform: step === 3 ? 'scale(0.85)' : 'scale(1)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 3L19 12L12 13L9 20L5 3Z"
            fill="#1A1A1A"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

const CARD_COMPONENTS = {
  shuffler: Shuffler,
  signature: SignatureAnim,
  scheduler: VisitScheduler,
}

/* ----------------------------------------------------------------
   3. Features
---------------------------------------------------------------- */
function Features() {
  const { FEATURES, COPY } = useSite()
  const sectionRef = useRef(null)

  useAnimacao((gsap) => {
    gsap.from('.feature-card', {
      scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    })
  }, sectionRef)

  return (
    <section id="metodo" ref={sectionRef} className="relative py-24 sm:py-32 grid-bg">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary-dark mb-4">
            {COPY.features.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tighter text-balance">
            {COPY.features.titleA}{' '}
            <span className="font-serif italic font-medium text-primary">
              {COPY.features.titleB}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Card = CARD_COMPONENTS[f.kind]
            return (
              <article
                key={f.eyebrow}
                className="feature-card rounded-3xl bg-surface border border-divider p-6 sm:p-8 lift-on-hover"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-2">
                  {f.eyebrow}
                </p>
                <h3 className="font-display text-xl font-bold tracking-tight mb-6 leading-snug">
                  {f.title}
                </h3>
                <Card />
                <p className="mt-6 text-muted text-sm leading-relaxed">{f.body}</p>
                <ul className="mt-4 space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-ink/80">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   4. Pillars
---------------------------------------------------------------- */
// As colunas seguem o número de pilares que sobreviveram ao corte da prova do
// Google. Numa grelha fixa de três, um par ficava encostado à esquerda com a
// terceira coluna vazia; aqui a grelha estreita-se e o `mx-auto` centra-a.
// Escrito por extenso porque o Tailwind procura as classes no ficheiro — uma
// classe montada como `lg:grid-cols-${n}` nunca chega a ser gerada.
const LARGURA = {
  1: 'lg:grid-cols-1 lg:max-w-md',
  2: 'lg:grid-cols-2 lg:max-w-3xl',
  3: 'lg:grid-cols-3',
}

function Pillars() {
  const { PILLARS } = useSite()
  // Uma lead sem nota, sem avaliações e sem horário conhecido deixa os três
  // pilares vazios. Dado ausente remove o componente — nunca uma grelha vazia.
  if (!PILLARS.length) return null

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className={`grid ${LARGURA[PILLARS.length] ?? LARGURA[3]} mx-auto lg:divide-x divide-divider`}>
          {PILLARS.map((p) => (
            <div key={p.label} className="px-0 lg:px-10 py-8 first:lg:pl-0 last:lg:pr-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-4">
                {p.label}
              </p>
              <div className="font-display text-6xl sm:text-7xl font-bold tracking-tighter gradient-text">
                <CountUp end={p.end} suffix={p.suffix || ''} decimals={p.decimals || 0} />
              </div>
              <div className="relative mt-5 h-px w-full overflow-hidden bg-divider/60">
                <span
                  className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                  style={{ animation: 'pillar-sweep 3s ease-in-out infinite' }}
                />
              </div>
              <p className="mt-5 text-muted text-sm leading-relaxed max-w-xs">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pillar-sweep {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(200%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </section>
  )
}

/* ----------------------------------------------------------------
   5. Protocol — pilha sticky
---------------------------------------------------------------- */
function Protocol() {
  const { STEPS, COPY } = useSite()
  const wrapRef = useRef(null)

  useAnimacao((gsap) => {
    const cards = gsap.utils.toArray('.protocol-card')
    cards.slice(0, -1).forEach((card) => {
      gsap.to(card, {
        scrollTrigger: { trigger: card, start: 'top top+=110', end: '+=520', scrub: 1 },
        scale: 0.92,
        filter: 'blur(6px) saturate(0.7)',
        opacity: 0.5,
        ease: 'none',
      })
    })
  }, wrapRef)

  return (
    <section id="processo" ref={wrapRef} className="relative bg-background pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary-dark mb-4">
            {COPY.steps.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tighter text-balance">
            {COPY.steps.titleA}{' '}
            <span className="font-serif italic font-medium text-primary">{COPY.steps.titleB}</span>
          </h2>
        </div>

        <div className="relative">
          {STEPS.map((s) => (
            <div key={s.n} className="sticky top-24 mb-8" style={{ minHeight: '1px' }}>
              <article className="protocol-card rounded-4xl bg-surface border border-divider shadow-xl shadow-ink/5 overflow-hidden">
                <div className="grid lg:grid-cols-5">
                  <div className="lg:col-span-3 p-8 sm:p-12">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-display text-5xl font-bold text-primary/20 tracking-tighter">
                        {s.n}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                        {s.eyebrow}
                      </span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-5 text-balance">
                      {s.title}
                    </h3>
                    <p className="text-muted leading-relaxed max-w-lg">{s.text}</p>
                    <ul className="mt-7 space-y-3">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="lg:col-span-2 relative min-h-[220px] lg:min-h-full">
                    <img
                      src={s.img}
                      srcSet={conjunto(s.img, [480, 768, 1024, 1536])}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      alt={s.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep/40 to-transparent" />
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   6. ServicesGrid
---------------------------------------------------------------- */
function ServicesGrid() {
  const { SERVICES, COPY } = useSite()
  const ref = useRef(null)

  useAnimacao((gsap) => {
    gsap.from('.svc-tile', {
      scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
    })
  }, ref)

  return (
    <section id="servicos" ref={ref} className="bg-deep text-white py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-4">
            {COPY.services.eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tighter text-white text-balance">
            {COPY.services.titleA}{' '}
            <span className="font-serif italic font-medium text-primary-light">
              {COPY.services.titleB}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="svc-tile group bg-deep p-8 sm:p-10 transition-colors hover:bg-white/[0.03]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary transition-transform duration-300 group-hover:scale-110">
                <s.icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <h3 className="font-display text-xl font-semibold mt-6 mb-3">{s.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   7. TrustSignals
---------------------------------------------------------------- */
function TrustSignals() {
  const { TRUST } = useSite()
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), {
      threshold: 0.3,
    })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="bg-background py-24 sm:py-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 grid lg:grid-cols-3 gap-6">
        {TRUST.map((b, i) => {
          const Wrapper = b.href ? 'a' : 'div'
          return (
            <Wrapper
              key={b.title}
              {...(b.href ? { href: b.href, target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="block bg-surface border border-divider rounded-2.5xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <b.icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <h3 className="font-display text-lg font-semibold mt-5 mb-2">{b.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{b.text}</p>
            </Wrapper>
          )
        })}
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   8. Avaliações (ticker)
---------------------------------------------------------------- */
const AVATAR_COLORS = ['#4285F4', '#DB4437', '#0F9D58', '#7B1FA2', '#00838F', '#EF6C00']

function ReviewAvatar({ review, size = 'w-12 h-12' }) {
  if (review.avatar) {
    return (
      <img
        src={review.avatar}
        alt={`Foto de ${review.author}`}
        width="48"
        height="48"
        loading="lazy"
        decoding="async"
        className={`${size} rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100`}
      />
    )
  }
  const color = AVATAR_COLORS[review.author.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <span
      aria-hidden="true"
      className={`${size} rounded-lg shrink-0 grid place-items-center font-display font-semibold text-white`}
      style={{ background: color }}
    >
      {review.author[0]}
    </span>
  )
}

function ReviewCard({ review, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-[300px] sm:w-[400px] shrink-0 text-left bg-white p-5 rounded-xl border border-divider shadow-sm flex gap-4 items-start hover:border-slate-300 hover:shadow-md transition-all relative"
    >
      <ReviewAvatar review={review} />
      <span className="flex flex-col gap-1 pr-6">
        <span className="text-sm text-muted leading-relaxed whitespace-normal font-medium line-clamp-3">
          {review.text}
        </span>
        <span className="text-xs font-bold text-ink mt-1">@{review.author}</span>
      </span>
      <span className="absolute bottom-5 right-5 w-5 h-5 opacity-60">
        <GoogleLogo className="w-5 h-5" />
      </span>
    </button>
  )
}

function ReviewsTicker() {
  const { BRAND, REVIEWS, COPY } = useSite()
  const [open, setOpen] = useState(null)
  const half = Math.ceil(REVIEWS.length / 2)
  const rows = [REVIEWS.slice(0, half), REVIEWS.slice(half)]

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const review = open === null ? null : REVIEWS[open]

  return (
    <section id="avaliacoes" className="bg-background py-24 sm:py-32 overflow-hidden">
      <div className="text-center max-w-2xl mx-auto px-6 mb-12">
        {BRAND.ratingValue ? (
          <>
            <div className="flex items-center justify-center gap-1 mb-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className="esu-badge__stars">
                  <RatingStar fill={Math.max(0, Math.min(1, BRAND.ratingValue - i))} />
                </span>
              ))}
            </div>
            <p className="text-sm text-muted mb-6">
              <strong className="text-ink font-semibold">{BRAND.rating}/5</strong> com base em{' '}
              <strong className="text-ink font-semibold">{BRAND.reviews}</strong> avaliações no Google
            </p>
          </>
        ) : null}
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tighter mb-4 text-balance">
          {COPY.reviews.titleA}{' '}
          <span className="font-serif italic font-medium text-primary">{COPY.reviews.titleB}</span>
        </h2>
        <p className="text-muted leading-relaxed">{COPY.reviews.sub}</p>
      </div>

      <div className="ticker-group w-full flex flex-col gap-4 mask-linear-fade">
        {rows.map((row, r) => (
          <div
            key={r}
            className={`flex w-max gap-4 ${r % 2 ? 'animate-ticker-reverse' : 'animate-ticker'}`}
            style={{ animationDuration: r % 2 ? '55s' : '45s' }}
          >
            {[0, 1, 2].map((copy) =>
              row.map((rev) => (
                <ReviewCard
                  key={`${copy}-${rev.author}`}
                  review={rev}
                  onOpen={() => setOpen(REVIEWS.indexOf(rev))}
                />
              ))
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12 px-6">
        <a
          href={BRAND.maps}
          target="_blank"
          rel="noopener nofollow"
          className="magnetic-btn inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/25"
        >
          Ver todas no Google <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      {review && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Avaliação de ${review.author}`}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[70] grid place-items-center bg-deep/70 backdrop-blur-sm p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-surface rounded-3xl p-8 shadow-2xl"
          >
            <button
              onClick={() => setOpen(null)}
              aria-label="Fechar"
              className="absolute top-5 right-5 text-muted hover:text-ink transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4">
              <ReviewAvatar review={review} size="w-14 h-14" />
              <div>
                <p className="font-display font-bold text-lg">{review.author}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  {review.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-5 esu-badge__stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <RatingStar key={i} />
              ))}
            </div>
            <p className="mt-4 text-muted leading-relaxed">{review.text}</p>
            <div className="mt-6 flex items-center gap-2 pt-5 border-t border-divider">
              <span className="w-5 h-5">
                <GoogleLogo className="w-5 h-5" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Avaliação publicada no Google
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/* ----------------------------------------------------------------
   9. ContactForm
---------------------------------------------------------------- */
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  )
}

const inputCls =
  'w-full rounded-2xl border border-divider bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25'

// O Unsplash serve o mesmo ficheiro em qualquer largura pelo parâmetro `w` (e
// já devolve WebP com `auto=format`), portanto o srcset sai de graça: o
// telemóvel descarrega 640 px em vez dos 2000 do ecrã grande. Sem `w=` no URL
// não há nada a fazer — devolve undefined e o atributo não é escrito.
// Duas origens de imagem, dois modos de pedir uma versão estreita:
//
//   Unsplash        muda-se o parâmetro `w=` do endereço.
//   fotos do cliente  o `npm run webp` deixa `nome-640.webp` ao lado da
//                     original de 1920 px, e é a essas que o srcset aponta.
//
// Sem o segundo caso o `srcset` saía `undefined` e um telemóvel de 412 px
// descarregava a imagem de 1920 px inteira — era o maior atraso do LCP.
// A escada das fotos locais é fixa porque é a que existe em disco: mudá-la
// aqui obriga a mudar o `LARGURAS` do `scripts/webp.mjs`.
const conjunto = (url, larguras) =>
  /[?&]w=\d+/.test(url ?? '')
    ? larguras.map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`).join(', ')
    : /^\/fotos\/.+\.webp$/.test(url ?? '')
      ? [640, 960, 1280]
          .map((w) => `${url.replace(/\.webp$/, `-${w}.webp`)} ${w}w`)
          .concat(`${url} 1920w`)
          .join(', ')
      : undefined

// Ligar ou abrir o WhatsApp é o sinal que separa "espreitou o site" de "quer
// falar". Só se mede numa proposta: no site de um cliente, saber quem clicou é
// da operação de vendas e não lhe diz respeito — por isso `rastrear` desliga-o.
// O nome do servidor de onde a pessoa veio, e mais nada. O `document.referrer`
// inteiro podia trazer termos de pesquisa ou identificadores na query, e para o
// relatório do cliente basta saber que veio do 'google.com'. Visita direta fica
// em branco, que também é resposta.
const deOndeVeio = () => {
  try { return new URL(document.referrer).hostname } catch { return '' }
}

const registarClique = (tipo, servico) => {
  if (!servico?.rastrear) return
  try {
    fetch(`${servico.api}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caminho: servico.site || window.location.pathname.replace(/\/$/, ''), tipo }),
      keepalive: true,
    }).catch(() => {})
  } catch {}
}

function ContactForm() {
  const { BRAND, FAQ, COPY, SERVICO } = useSite()
  const [status, setStatus] = useState('idle')

  // Envia mesmo. O caminho da página identifica a demo do lado do servidor —
  // é o que existe nos dois mundos sem acrescentar config ao template.
  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const dados = new FormData(e.currentTarget)
    // Numa proposta o caminho da página chega para identificar a demo. Num site
    // ejetado o caminho é "/" e não corresponde a nada — vem da config.
    dados.set('caminho', SERVICO.site || window.location.pathname.replace(/\/$/, ''))
    try {
      const r = await fetch(`${SERVICO.api}/api/contacto`, { method: 'POST', body: dados })
      setStatus(r.ok ? 'sent' : 'erro')
    } catch {
      setStatus('erro')
    }
  }

  const contactCards = [
    {
      icon: Phone,
      label: BRAND.phoneKind === 'fixo' ? 'Telefone' : 'Telemóvel',
      value: BRAND.phoneDisplay,
      href: `tel:${BRAND.phoneTel}`,
      nota: BRAND.phoneNote,
    },
    { icon: Mail, label: 'Email', value: BRAND.email, href: `mailto:${BRAND.email}` },
    {
      icon: MapPin,
      // Morada de rua quando o negócio a divulga; senão a zona onde trabalha,
      // que é o que representa honestamente quem vai a casa do cliente.
      label: BRAND.morada ? 'Morada' : 'Zona',
      value: BRAND.morada || [BRAND.city, BRAND.region].filter(Boolean).join(' · '),
      href: BRAND.maps,
    },
    // Dado ausente tira o cartão inteiro; nunca deixa "mailto:null" nem "Lisboa · ".
  ].filter((c) => c.value && c.href)

  return (
    <section id="contactos" className="bg-background py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary-dark mb-4">
            Contactos
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tighter mb-6 text-balance">
            {COPY.contact.titleA}{' '}
            <span className="font-serif italic font-medium text-primary">
              {COPY.contact.titleB}
            </span>
          </h2>
          <p className="text-muted leading-relaxed max-w-md mb-10">{COPY.contact.sub}</p>

          <div className="space-y-3">
            {contactCards.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="flex items-center gap-4 bg-surface border border-divider rounded-2xl p-4 lift-on-hover"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                {/* `min-w-0` sozinho não chegava: o `truncate` do valor mantém
                    `nowrap`, e um email ou uma morada compridos empurravam a
                    coluna toda para lá dos 375 px. Base zero fecha a conta. */}
                <span className="min-w-0 w-0 flex-1">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                    {c.label}
                  </span>
                  <span className="block font-display font-semibold truncate">{c.value}</span>
                  {/* O custo da chamada tem de estar junto ao número. */}
                  {c.nota ? (
                    <span className="block text-[11px] text-muted mt-0.5">{c.nota}</span>
                  ) : null}
                </span>
              </a>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted leading-relaxed max-w-sm">
            {BRAND.hours ? `Horário: ${BRAND.hours}. ` : ''}Os seus dados são usados apenas para
            responder a este pedido e não são partilhados com terceiros.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-surface border border-divider rounded-3xl p-6 sm:p-10 shadow-xl shadow-ink/5">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="font-display text-2xl font-bold mb-3">Obrigado — pedido enviado.</h3>
                <p className="text-muted text-sm max-w-sm">
                  Enviámos-lhe uma confirmação por email. Se for urgente, ligue para{' '}
                  {BRAND.phoneDisplay}.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-dark hover:underline"
                >
                  Enviar outro pedido
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Nome">
                    <input required name="nome" className={inputCls} placeholder="O seu nome" />
                  </Field>
                  <Field label="Email">
                    <input required type="email" name="email" className={inputCls} placeholder="nome@email.pt" />
                  </Field>
                </div>
                <Field label="Telemóvel">
                  <input name="telefone" className={inputCls} placeholder="9xx xxx xxx" />
                </Field>
                <Field label={COPY.contact.fieldLabel}>
                  <textarea
                    rows={5}
                    name="mensagem"
                    className={inputCls}
                    placeholder={COPY.contact.fieldPlaceholder}
                  />
                </Field>

                {/* Invisível para quem preenche; se vier com texto é um robô. */}
                <input
                  type="text"
                  name="empresa"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute h-0 w-0 opacity-0 -z-10"
                />

                {status === 'erro' && (
                  <p
                    role="alert"
                    className="flex items-start gap-2.5 rounded-2xl bg-primary/5 border border-primary/20 px-4 py-3 text-sm text-ink/80"
                  >
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                    <span>
                      Não foi possível enviar o pedido. Tente novamente ou ligue para{' '}
                      {BRAND.phoneDisplay}.
                    </span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="magnetic-btn w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-semibold shadow-lg shadow-primary/25 disabled:opacity-70"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> A enviar…
                    </>
                  ) : (
                    <>
                      Enviar pedido <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   9b. Perguntas frequentes
   Só existe com perguntas do próprio negócio. Um FAQ genérico do nicho não
   responde a nada e, marcado como FAQPage, seria marcação sem conteúdo real
   por trás — que é exatamente o que o Google trata como enganoso.
---------------------------------------------------------------- */
function Faq() {
  const { FAQ, COPY } = useSite()
  if (!FAQ?.length) return null

  return (
    <section id="perguntas" className="bg-surface py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary-dark mb-4">
          Perguntas frequentes
        </p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tighter mb-12 text-balance">
          {COPY.faq?.titleA ?? 'O que perguntam'}{' '}
          <span className="font-serif italic font-medium text-primary">
            {COPY.faq?.titleB ?? 'mais vezes'}
          </span>
        </h2>

        <dl className="divide-y divide-divider border-y border-divider">
          {FAQ.map((f) => (
            <div key={f.pergunta} className="py-6">
              <dt className="font-display text-lg font-semibold text-ink">{f.pergunta}</dt>
              <dd className="mt-2 text-muted leading-relaxed">{f.resposta}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------------
   Redes sociais
---------------------------------------------------------------- */
// O lucide deixou de trazer marcas registadas, por isso os glifos vêm aqui em
// SVG. A ordem da tabela é a ordem em que aparecem, para não depender da ordem
// com que o Apify encontrou as redes.
const REDES_SOCIAIS = {
  instagram: { nome: 'Instagram', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
  facebook: { nome: 'Facebook', d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
  tiktok: { nome: 'TikTok', d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
  youtube: { nome: 'YouTube', d: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
  linkedin: { nome: 'LinkedIn', d: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  twitter: { nome: 'X', d: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z' },
}

// Só as redes que o negócio tem mesmo. Sem nenhuma, o bloco não existe — a
// mesma regra de todo o site: dado ausente remove o componente.
function Sociais() {
  const { BRAND } = useSite()
  const redes = Object.entries(REDES_SOCIAIS)
    .map(([chave, rede]) => [rede, BRAND.sociais?.[chave]])
    .filter(([, url]) => typeof url === 'string' && url.startsWith('http'))

  if (!redes.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {redes.map(([rede, url]) => (
        <a
          key={rede.nome}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${BRAND.name} no ${rede.nome}`}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d={rede.d} />
          </svg>
        </a>
      ))}
    </div>
  )
}

/* ----------------------------------------------------------------
   10. Footer
---------------------------------------------------------------- */
export function Footer() {
  const { BRAND, SERVICES, COPY, SERVICO, basePath } = useSite()
  return (
    <footer className="bg-deep text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Seis colunas e não cinco. A dos contactos leva duas, como a da
            marca: com uma só, um email como `eletrocanalizacoes@gmail.com`
            partia-se a meio da palavra e ficava com o `om` na linha de baixo.
            A marca continua com duas e o que perde é folga — a tagline já tem
            o `max-w-xs` dela. */}
        <div className="grid lg:grid-cols-6 gap-12">
          {/* O `text-lg` está no contentor e não na tagline de propósito: o acerto
              da serif no globals.css é em `em`, e uma classe text-* no próprio
              elemento tapava-o. Assim a tagline herda 18 px e a serif cresce a
              partir daí. Os irmãos trazem tamanho próprio e não são afetados. */}
          <div className="lg:col-span-2 flex flex-col gap-3 text-lg">
            <div className="flex items-center gap-2">
              <Marca dim="h-10 w-10" logoDim="h-20" />
              <span className={`font-display font-bold text-2xl ${BRAND.logo ? 'sr-only' : ''}`}>
                {BRAND.name}
              </span>
            </div>
            <p className="font-serif italic text-white/70 max-w-xs">{BRAND.tagline}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="relative h-2 w-2 rounded-full bg-emerald-500">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/60">
                {COPY.footerStatus}
              </span>
            </div>
            <Sociais />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
              Serviços
            </p>
            <ul className="space-y-2.5">
              {SERVICES.map((s) => (
                <li key={s.title}>
                  <a href={`${basePath}/#servicos`} className="text-white/70 hover:text-primary text-sm transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
              Empresa
            </p>
            <ul className="space-y-2.5">
              {[
                { label: 'Como trabalhamos', href: '#metodo' },
                { label: 'Processo', href: '#processo' },
                { label: 'Avaliações', href: '#avaliacoes' },
                { label: 'Contactos', href: '#contactos' },
                { label: 'Ver no Google Maps', href: BRAND.maps },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href.startsWith('#') ? `${basePath}/${l.href}` : l.href}
                    {...(l.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="text-white/70 hover:text-primary text-sm transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
              Contactos
            </p>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a
                  href={`tel:${BRAND.phoneTel}`}
                  onClick={() => registarClique('cta_click', SERVICO)}
                  className="hover:text-primary transition-colors"
                >
                  {BRAND.phoneDisplay}
                </a>
                {BRAND.phoneNote ? (
                  <span className="block text-[11px] text-white/40">{BRAND.phoneNote}</span>
                ) : null}
              </li>
              {BRAND.email ? (
                <li>
                  <a href={`mailto:${BRAND.email}`} className="hover:text-primary transition-colors">
                    {BRAND.email}
                  </a>
                </li>
              ) : null}
              {[BRAND.city, BRAND.region].filter(Boolean).length ? (
                <li>{[BRAND.city, BRAND.region].filter(Boolean).join(', ')}</li>
              ) : null}
              {BRAND.hours ? <li className="text-white/50">{BRAND.hours}</li> : null}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            © {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href={`${basePath}/privacidade`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-primary transition-colors"
            >
              Privacidade
            </Link>
            <Link
              href={`${basePath}/termos`}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 hover:text-primary transition-colors"
            >
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ----------------------------------------------------------------
   Botão flutuante: WhatsApp (ou chamada, se não houver WhatsApp)
---------------------------------------------------------------- */
function FloatingContact() {
  const { BRAND, SERVICO } = useSite()
  const hasWhatsApp = Boolean(BRAND.whatsapp)
  const href = hasWhatsApp
    ? `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(BRAND.whatsappMsg)}`
    : `tel:${BRAND.phoneTel}`

  return (
    <a
      href={href}
      onClick={() => registarClique(hasWhatsApp ? 'whatsapp_click' : 'telefone_click', SERVICO)}
      {...(hasWhatsApp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      aria-label={
        hasWhatsApp ? `Falar com a ${BRAND.name} no WhatsApp` : `Ligar para ${BRAND.phoneDisplay}`
      }
      className="group fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex items-center gap-3"
    >
      <span className="hidden sm:block max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-surface text-ink text-sm font-semibold shadow-lg shadow-ink/10 border border-divider opacity-0 transition-all duration-300 group-hover:max-w-[16rem] group-hover:opacity-100 group-hover:px-4 group-hover:py-2.5">
        {hasWhatsApp ? 'Falar por WhatsApp' : `Ligar ${BRAND.phoneDisplay}`}
      </span>

      <span
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
        style={{
          background: hasWhatsApp ? '#25D366' : 'var(--brand-primary)',
          boxShadow: `0 10px 25px ${hasWhatsApp ? 'rgba(37,211,102,0.35)' : 'var(--brand-primary-shadow)'}`,
        }}
      >
        <span
          className="absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping"
          style={{ background: hasWhatsApp ? '#25D366' : 'var(--brand-primary)' }}
        />
        {hasWhatsApp ? (
          <svg viewBox="0 0 24 24" className="relative h-7 w-7 fill-white" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.548 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        ) : (
          <Phone className="relative h-6 w-6 text-white" strokeWidth={2.4} />
        )}
      </span>
    </a>
  )
}

/* ----------------------------------------------------------------
   App
---------------------------------------------------------------- */
function ArvoreDoSite() {
  // Só há posições para recalcular se houver animações, e sem elas o GSAP nem
  // chega a ser descarregado.
  useEffect(() => {
    if (prefersReducedMotion) return
    let saiu = false
    const parar = depoisDoLoad(() => {
      carregarGsap().then(({ ScrollTrigger }) => { if (!saiu) ScrollTrigger.refresh() })
    })
    return () => { saiu = true; parar() }
  }, [])

  return (
    <div className="relative">
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pillars />
        <Protocol />
        <ServicesGrid />
        <TrustSignals />
        <ReviewsTicker />
        <Faq />
        <ContactForm />
      </main>
      <RodapeZonas />
      <Footer />
      <FloatingContact />
    </div>
  )
}

export default function Site({ tema, lead, enrich, cliente, local, servico, basePath, zonas }) {
  return (
    <SiteProvider tema={tema} lead={lead} enrich={enrich} cliente={cliente}
                  local={local} servico={servico} basePath={basePath} zonas={zonas}>
      <ArvoreDoSite />
    </SiteProvider>
  )
}
