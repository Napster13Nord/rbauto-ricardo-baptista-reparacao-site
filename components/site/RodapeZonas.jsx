'use client'
// A lista das páginas de zona, para o pé do rodapé.
//
// **Não vem do `_gerador/tpl/`, pela mesma razão que o `PaginaZona.jsx`:** uma
// zona nasce depois da venda, quando o cliente confirma onde trabalha, e não
// existe em demo nenhuma. Pôr isto no template obrigava a `site.config.jsx` dos
// sites Vite a exportar um `ZONAS` que eles nunca terão.
//
// O `port-app.mjs` é que a pendura antes do `<Footer />` do `Site.jsx` gerado,
// e as páginas de zona e legais chamam-na a par do rodapé. Assim a lista está
// em todas as páginas e continua a haver um só sítio onde ela se escreve.
//
// Sem isto as páginas de zona eram órfãs: chegava-se a elas pelo sitemap e por
// mais nada, nem o visitante nem o peso das ligações internas lá iam ter.
import Link from 'next/link'
import { useSite } from './SiteContext'

export default function RodapeZonas() {
  const { ZONAS, basePath } = useSite()
  if (!ZONAS.length) return null

  return (
    // Abre a mancha escura do rodapé em vez de ser uma faixa própria: a cor é
    // que separa isto da secção clara de cima, e o `pt-20` do `<Footer />` dá o
    // espaço a seguir. Fica no rodapé e não na navegação porque são doze e a
    // barra de topo tem cinco entradas.
    <div className="bg-deep text-white pt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">
          Onde trabalhamos
        </p>
        {/* Duas colunas no telemóvel, uma linha que enrola daí para cima.
            A doze nomes num ecrã de 390 px, o `flex-wrap` dava quatro linhas
            irregulares com os nomes a atropelarem-se e "Vila Nova de Gaia"
            sozinha no fim: lia-se como uma frase corrida, não como uma lista.
            Em grelha os nomes alinham e contam-se de relance.

            O `gap-y-4` é para o telemóvel: com `2.5` ficavam 10 px entre linhas
            de 20 px de altura, cada nome colado ao de baixo, e num ecrã tátil
            os alvos ficavam a tocar-se. Na linha única do computador não muda
            nada, que aí não há segunda linha. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-5">
          {ZONAS.map((z) => (
            <Link
              key={z.caminho}
              href={`${basePath}/${z.caminho}/`}
              className="text-white/70 hover:text-primary text-sm transition-colors"
            >
              {z.zona}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
