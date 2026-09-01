'use client'
// GERADO por scripts/port-app.mjs a partir de _gerador/tpl/LegalLayout.jsx — não editar à mão.
import Link from 'next/link'
import { Navbar, Footer } from '../Site'
import RodapeZonas from '../RodapeZonas'
import { ArrowUpRight } from 'lucide-react'
import { useSite } from '../SiteContext'

export default function LegalLayout({ title, updated, children }) {
  const { BRAND, LogoIcon, basePath } = useSite()
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-deep text-white pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          <h1 className="mt-12 font-display text-4xl sm:text-5xl font-bold tracking-tighter">
            {title}
          </h1>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
            Atualizado em {updated}
          </p>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 sm:px-10 py-16 space-y-8 text-sm leading-relaxed text-muted [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mb-2 [&_a]:text-primary-dark [&_a]:underline">
        {children}
      </article>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 pb-24">
        <Link
          href={basePath || '/'}
          className="magnetic-btn inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/25"
        >
          Voltar ao início <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <RodapeZonas />
      <Footer />
    </div>
  )
}
