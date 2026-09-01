'use client'
import { useEffect, useRef, useState } from 'react'

// Quem abre o link tem de perceber ao primeiro segundo o que está a ver e de
// quem veio. A faixa do rodapé (PLANO.md §8.3) fica onde está, mas vinha depois
// de 1700 linhas de página — muita gente nunca lá chegava.
//
// "Ver como cliente" esconde esta barra para o dono ver a experiência limpa que
// os clientes dele teriam. A faixa do rodapé continua lá, portanto a demo nunca
// fica sem marcador, nem com a barra escondida.
export default function BarraDemo({ nome, contacto, cta }) {
  const [visivel, setVisivel] = useState(true)
  const barra = useRef(null)

  // A pílula de navegação do site é `fixed top-4` e ficaria por baixo da barra.
  // A altura é medida em vez de adivinhada: a 375 px o texto passa a duas linhas
  // e um desvio fixo deixava o menu tapado.
  useEffect(() => {
    const raiz = document.documentElement
    const aplicar = () => raiz.style.setProperty(
      '--barra-demo', visivel && barra.current ? `${barra.current.offsetHeight}px` : '0px')
    aplicar()
    window.addEventListener('resize', aplicar)
    return () => {
      window.removeEventListener('resize', aplicar)
      raiz.style.removeProperty('--barra-demo')
    }
  }, [visivel])

  if (!visivel) {
    return (
      <button
        type="button"
        onClick={() => setVisivel(true)}
        className="fixed left-3 top-3 z-[80] rounded-full bg-deep/90 px-3 py-1.5 font-mono
                   text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur
                   hover:text-white"
      >
        demonstração
      </button>
    )
  }

  return (
    <div ref={barra}
         className="barra-demo fixed inset-x-0 top-0 z-[80] flex flex-wrap items-center
                    justify-center gap-x-4 gap-y-1 bg-deep px-4 py-2 text-center">
      <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/70">
        Demonstração preparada para <span className="text-white">{nome}</span>
        {contacto ? <span className="text-white/40"> · {contacto}</span> : null}
      </p>

      <span className="flex items-center gap-3">
        {cta ? (
          <a
            href={cta}
            className="rounded-full bg-primary px-3 py-1 font-mono text-[10px] uppercase
                       tracking-[0.16em] text-white hover:opacity-90"
          >
            Quero colocar online
          </a>
        ) : null}
        <button
          type="button"
          onClick={() => setVisivel(false)}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/50 underline
                     hover:text-white/80"
        >
          ver como cliente
        </button>
      </span>
    </div>
  )
}
