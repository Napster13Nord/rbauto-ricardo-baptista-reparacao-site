'use client'
import { useEffect, useRef, useState } from 'react'
import { PALETAS } from '../../lib/paletas'
import { TIPOGRAFIAS, variaveisDaTipografia } from '../../lib/tipografias'
import { canais } from '../../lib/cores'

// A barra onde a lead experimenta cores e letra na demo dela.
//
// Não é um brinquedo: o sinal de venda está em quem mexe. Uma lead que troca de
// paleta três vezes está a imaginar o site como sendo dela, e isso vale mais do
// que uma abertura de email. Por isso cada escolha é registada no `/api/track`.
//
// A troca é toda do lado do browser, a reescrever as mesmas variáveis CSS que o
// servidor escreveu — nenhuma volta ao servidor, nada guardado no dispositivo,
// e por isso nada que obrigue a um banner de consentimento. Recarregar a página
// devolve a paleta do nicho, que é o comportamento certo: o que o vendedor
// enviou é o que o link mostra da próxima vez.
//
// Só aparece em propostas. No site vendido o `PaginaDemo` nem chega a montá-la.

// Só as variáveis mudam; nada de classes nem de reconstruir o Tailwind.
function aplicarPaleta(p) {
  const raiz = document.documentElement
  raiz.style.setProperty('--primary', canais(p.primary))
  raiz.style.setProperty('--primary-dark', canais(p.primaryDark))
  raiz.style.setProperty('--primary-light', canais(p.primaryLight))
  raiz.style.setProperty('--accent', canais(p.accent))
  raiz.style.setProperty('--accent-dark', canais(p.accentDark))
}

// As folhas do Google só são pedidas quando a lead abre o painel, e uma só vez
// cada. Carregá-las com a página juntava centenas de kB a quem só vem ver o
// site, e a velocidade é meio argumento de venda. Quem abre o painel já está
// interessado — é aí que o custo faz sentido, e é o que permite as amostras
// aparecerem na letra certa antes de serem escolhidas.
const pedidas = new Set()
function pedirFolha(t) {
  if (!t.href || pedidas.has(t.id)) return
  pedidas.add(t.id)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = t.href
  document.head.appendChild(link)
}

function carregarLetra(t) {
  pedirFolha(t)
  const raiz = document.documentElement
  for (const [k, v] of Object.entries(variaveisDaTipografia(t))) raiz.style.setProperty(k, v)

  // O desenho do título — partido em duas letras ou numa só. É isto que faz as
  // quatro combinações parecerem diferentes; sem ele mudava a letra e a página
  // ficava com o mesmo ar. As regras estão no globals.css.
  if (t.estilo === 'unico') raiz.setAttribute('data-titulo', 'unico')
  else raiz.removeAttribute('data-titulo')
}

export default function SeletorEstilo({ demoId, corInicial }) {
  const [aberto, setAberto] = useState(false)
  const [cor, setCor] = useState(null)
  const [letra, setLetra] = useState('original')
  const painel = useRef(null)

  // Uma escolha por tipo é quanto basta para o painel saber que houve interesse.
  // Registar as dezassete trocas de quem está a brincar só enchia a tabela.
  const registados = useRef(new Set())
  function registar(o_que) {
    if (!demoId || registados.current.has(o_que)) return
    registados.current.add(o_que)
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoId, tipo: 'estilo', detalhe: o_que }),
      keepalive: true,
    }).catch(() => {})
  }

  function escolherCor(p) {
    aplicarPaleta(p)
    setCor(p.id)
    registar(`paleta:${p.id}`)
  }

  function escolherLetra(t) {
    carregarLetra(t)
    setLetra(t.id)
    registar(`letra:${t.id}`)
  }

  // Fechar com Escape e ao carregar fora: um painel aberto por cima do site
  // tapa aquilo que a lead está aqui para ver.
  // As quatro folhas chegam quando o painel abre, para as amostras se lerem na
  // letra que anunciam. Antes disto, escolher às cegas era escolher pelo nome.
  useEffect(() => { if (aberto) TIPOGRAFIAS.forEach(pedirFolha) }, [aberto])

  useEffect(() => {
    if (!aberto) return
    const tecla = (e) => { if (e.key === 'Escape') setAberto(false) }
    const fora = (e) => { if (painel.current && !painel.current.contains(e.target)) setAberto(false) }
    document.addEventListener('keydown', tecla)
    document.addEventListener('mousedown', fora)
    return () => {
      document.removeEventListener('keydown', tecla)
      document.removeEventListener('mousedown', fora)
    }
  }, [aberto])

  const corAtiva = cor ?? corInicial ?? null

  return (
    // À esquerda porque o botão de contacto do site vive em baixo à direita
    // (`bottom-5 right-5`). Os dois no mesmo canto tapavam-se, e o que não pode
    // nunca ficar tapado é o botão que faz a lead ligar.
    <div ref={painel} className="fixed bottom-4 left-4 z-[75] flex flex-col items-start gap-2">
      {aberto ? (
        <div className="w-[17rem] rounded-2xl bg-deep/95 p-4 text-white shadow-2xl backdrop-blur
                        sm:w-80">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            Cores
          </p>
          <div className="mb-5 grid grid-cols-3 gap-2">
            {PALETAS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => escolherCor(p)}
                aria-pressed={corAtiva === p.id}
                title={p.nome}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 transition
                           ${corAtiva === p.id
                             ? 'border-white/70 bg-white/10'
                             : 'border-white/15 hover:border-white/40'}`}
              >
                <span className="flex gap-0.5" aria-hidden="true">
                  {[p.primaryDark, p.primary, p.accent].map((c) => (
                    <span key={c} className="h-4 w-2.5 rounded-sm" style={{ background: c }} />
                  ))}
                </span>
                <span className="font-mono text-[8px] uppercase leading-tight tracking-[0.1em]
                                 text-white/60">
                  {p.nome}
                </span>
              </button>
            ))}
          </div>

          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            Letra
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TIPOGRAFIAS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => escolherLetra(t)}
                aria-pressed={letra === t.id}
                className={`rounded-xl border px-3 py-2 text-left transition
                           ${letra === t.id
                             ? 'border-white/70 bg-white/10'
                             : 'border-white/15 hover:border-white/40'}`}
              >
                {/* A amostra imita um título verdadeiro: duas palavras, com a
                    segunda tratada como a página a trata. Assim vê-se o desenho
                    — partido em duas letras ou numa só — e não só a família. */}
                <span className="block text-[15px] leading-tight"
                      style={{ fontFamily: `${t.display}, system-ui, sans-serif`, fontWeight: 700 }}>
                  Feito{' '}
                  <span style={t.estilo === 'dividido'
                    ? { fontFamily: `${t.serif}, Georgia, serif`, fontStyle: 'italic', fontWeight: 500 }
                    : { fontWeight: 500 }}>
                    bem
                  </span>
                </span>
                <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.1em]
                                 text-white/60">
                  {t.nome}
                </span>
                <span className="block text-[9px] leading-tight text-white/35">
                  {t.resumo}
                </span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-[11px] leading-snug text-white/40">
            Experimente à vontade. Recarregar a página traz tudo ao início.
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex items-center gap-2 rounded-full bg-deep/90 px-4 py-2 font-mono text-[10px]
                   uppercase tracking-[0.16em] text-white/80 shadow-lg backdrop-blur
                   hover:text-white"
      >
        <span className="flex gap-0.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-primary" />
          <span className="-ml-1 h-3 w-3 rounded-full bg-accent" />
        </span>
        {aberto ? 'fechar' : 'mudar o estilo'}
      </button>
    </div>
  )
}
