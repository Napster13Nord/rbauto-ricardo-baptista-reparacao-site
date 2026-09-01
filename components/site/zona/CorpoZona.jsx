'use client'
// O corpo visível de uma página de zona.
//
// Ficheiro à parte, e é a razão de ser dele: usa hooks, portanto é de cliente,
// e o `PaginaZona.jsx` tem de continuar a ser de servidor para o Next lhe poder
// chamar o `metadataZona`. Foi o que a construção denunciou, e é o mesmo
// arranjo que as páginas legais já usam.
import Link from 'next/link'
import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react'
import { useSite } from '../SiteContext'
import Registar from '../Registar'
import RodapeZonas from '../RodapeZonas'
import { Navbar, Footer } from '../Site'

// Copiado do `Site.jsx`, dez linhas, e de propósito: aquele ficheiro é gerado
// pelo `port-app.mjs` a partir do template Vite e diz "não editar à mão".
// Acrescentar-lhe um `export` obrigava a mexer no gerador para duas chamadas.
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

export default function CorpoZona({ zona }) {
  const { BRAND, SERVICO, basePath } = useSite()

  return (
    <div className="min-h-screen bg-background">
      {/* Sem isto o tráfego das páginas de zona não aparecia em lado nenhum, e
          o cliente pagava por páginas que os números diziam não existir. Conta
          para o mesmo site, como a inicial. */}
      {SERVICO?.rastrear ? <Registar servico={SERVICO} /> : null}
      {/* O menu da página inicial, o mesmo componente. Aqui estava o logótipo
          solto com o nome ao lado, sem ligação nenhuma para o resto do site:
          quem chegava do Google só podia voltar atrás. O menu é `fixed` e
          flutua por cima, daí o `pt-32` em vez do `pt-16`. */}
      <Navbar />
      <div className="bg-deep text-white pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-10">
          {/* Os botões numa linha própria. Estavam soltos ao lado do logótipo,
              e como os três eram `inline-flex` cabiam todos na mesma linha: o
              telefone encostava ao nome do negócio e a margem de topo não fazia
              nada, porque não muda a linha de um elemento em linha. Este `div`
              é de bloco, e é ele que os separa. */}
          <div className="flex flex-wrap items-center gap-3">
            {/* O telefone acima da dobra. Quem chega a esta página tem uma fuga
                em casa e não veio ler. */}
            <a
              href={`tel:${BRAND.phoneTel}`}
              onClick={() => registarClique('telefone_click', SERVICO)}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/25"
            >
              <Phone className="h-4 w-4" /> {BRAND.phoneDisplay}
            </a>
          {/* O WhatsApp ao lado do telefone: nas quatro primeiras semanas do
              Pedro houve sete cliques no WhatsApp e dois no botão de
              assistência. É por ali que esta gente fala.

              **A mensagem nomeia a página.** Sem isto, o que chega diz "vim
              pelo site" e o cliente nunca sabe qual das páginas lhe trouxe o
              trabalho, que é exactamente o que ele está a pagar para saber. A
              pessoa pode apagar o texto antes de enviar; a maioria carrega em
              enviar.

              Vai o título e não o nome da terra, entre aspas. "Página de Porto"
              está errado, é "do Porto", e Valongo não leva artigo nenhum;
              tratar artigos de nomes de terras é um poço sem fundo. O título já
              vem com o artigo certo de quem escreveu a página, e entre aspas
              lê-se como um nome, que não pede concordância nenhuma. */}
            {BRAND.whatsapp ? (
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
                  `Olá, vim da página "${zona.titulo}" do site da ${BRAND.name} e queria pedir informações.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => registarClique('whatsapp_click', SERVICO)}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            ) : null}
          </div>
          {BRAND.phoneNote ? (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
              {BRAND.phoneNote}
            </p>
          ) : null}
        </div>
      </div>

      <article
        className="max-w-3xl mx-auto px-6 sm:px-10 py-16 text-sm leading-relaxed text-muted space-y-5 [&_h1]:font-display [&_h1]:text-3xl [&_h1]:sm:text-4xl [&_h1]:font-bold [&_h1]:tracking-tighter [&_h1]:text-ink [&_h1]:-mt-4 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:pt-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_strong]:text-ink [&_a]:text-primary-dark [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: zona.html }}
      />

      {/* Aqui estavam as vizinhas, em pastilhas: era assim que o rastreador
          chegava às outras zonas sem depender do sitemap. O rodapé passou a
          listá-las todas, e as duas listas ficavam uma por cima da outra com o
          botão pelo meio. A do rodapé fica, que é a que está em todas as
          páginas; o `zona.vizinhas` continua nos dados e não faz mal a ninguém. */}

      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12">
        <Link
          href={basePath || '/'}
          className="magnetic-btn inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-primary/25"
        >
          Ver todos os serviços <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* O rodapé da página inicial, o mesmo componente. Sem ele estas páginas
          acabavam a meio: nem contactos, nem horário, nem páginas legais, e
          quem chegasse aqui do Google não tinha para onde ir a não ser voltar
          atrás. */}
      <RodapeZonas />
      <Footer />
    </div>
  )
}
