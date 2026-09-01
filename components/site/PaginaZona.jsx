// A página de uma zona: "Canalizador em Ermesinde".
//
// **Não vem do `_gerador/tpl/`, e é a excepção à regra número um.** O gerador é
// a fonte da verdade do markup das demos, e uma página de zona não existe numa
// demo: nasce depois da venda, quando o cliente confirma onde trabalha. Não há
// original em Vite de que esta possa ser o porte.
//
// O corpo chega já em HTML, convertido no motor a partir do Markdown que o
// modelo escreveu, e escapado lá. Ver `lib/zona-pagina.js`.
//
// **Este ficheiro é de servidor**, sem `'use client'`, porque o Next chama-lhe
// o `metadataZona` do lado do servidor. O que precisa de hooks vive no
// `zona/CorpoZona.jsx`, como nas páginas legais.
import { SiteProvider } from './SiteContext'
import CorpoZona from './zona/CorpoZona'
import { variaveisDoTema } from '../../lib/cores'

export default function PaginaZona({ demo, zona, basePath, servico }) {
  const { tema, lead, enrich, cliente, local, zonas } = demo

  return (
    <>
      <style>{`:root{${Object.entries(variaveisDoTema(tema.colors))
        .map(([k, v]) => `${k}:${v}`).join(';')}}`}</style>
      {/* O `servico` entra como na página inicial. Sem ele o contexto caía no
          `SERVICO_LOCAL` e o registo de visitas batia em `/api/track` no
          domínio do próprio cliente, onde essa rota não existe. */}
      {/* As zonas todas, e não só esta: o rodapé desta página lista-as como o
          da página inicial. */}
      <SiteProvider tema={tema} lead={lead} enrich={enrich} cliente={cliente} local={local}
                    servico={servico} basePath={basePath} zonas={zonas}>
        <CorpoZona zona={zona} />
      </SiteProvider>
      {/* Os dados estruturados vêm prontos do motor. Um bloco por página, e o
          `@id` aponta à entidade da página inicial: um negócio, não doze. */}
      {(zona.jsonld ?? []).map((bloco, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bloco) }}
        />
      ))}
    </>
  )
}

/** O `<head>` desta página, no formato que o Next quer. */
export function metadataZona(demo, zona) {
  const raiz = demo.cliente.dominio.replace(/\/$/, '')
  const url = `${raiz}/${zona.caminho}/`
  const completo = `${zona.titulo} | ${demo.lead.nome_negocio}`
  return {
    // 60 caracteres é onde o Google corta, e o nome do negócio é o que se
    // perde: quem procura um canalizador não procura pelo nome dele.
    title: completo.length > 60 ? zona.titulo : completo,
    description: zona.descricao,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title: completo, description: zona.descricao },
    // Um deploy de teste não entra no Google, como no robots.
    robots: demo.teste ? { index: false, follow: true } : undefined,
  }
}
