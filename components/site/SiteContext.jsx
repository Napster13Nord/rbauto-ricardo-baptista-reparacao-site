'use client'
// Onde a lead real e o enriquecimento substituem o que era inventado.
// Mapeamento da secção 6 do PLANO.md. Nada aqui inventa: o que não vier do CSV
// nem do Apify ou é genérico do nicho ou desaparece.
import { createContext, useContext, useMemo } from 'react'
import { icone } from './icones'
import { mostrarProvaGoogle } from '../../lib/tema'

const Ctx = createContext(null)

export const useSite = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useSite fora de <SiteProvider>')
  return v
}

// 4.8 -> "4,8"  (vírgula decimal em português)
const virgula = (n) => (n == null ? '' : String(Number(n).toFixed(1)).replace('.', ','))

// O Apify devolve {seg:"08:00 – 20:00", …}; o template mostra uma linha de texto.
// Agrupa dias seguidos com o mesmo horário: "Seg a Sex 08:00 – 20:00 · Sáb 09:00 – 13:00".
const ORDEM = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
const ROTULO = { seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom' }

export function horarioEmTexto(horario) {
  if (!horario || typeof horario !== 'object') return null
  const dias = ORDEM.filter((d) => horario[d])
  if (!dias.length) return null

  const blocos = []
  for (const d of dias) {
    const ultimo = blocos[blocos.length - 1]
    const seguido = ultimo && ORDEM.indexOf(d) === ORDEM.indexOf(ultimo.fim) + 1
    if (seguido && ultimo.horas === horario[d]) ultimo.fim = d
    else blocos.push({ ini: d, fim: d, horas: horario[d] })
  }

  return blocos
    .filter((b) => !/^encerrado$/i.test(b.horas))
    .map((b) => `${b.ini === b.fim ? ROTULO[b.ini] : `${ROTULO[b.ini]} a ${ROTULO[b.fim]}`} ${b.horas}`)
    .join(' · ') || null
}

// "Eletricidade e Gás" -> "Eletricidade e Gás" (2 primeiras palavras)
const nomeCurto = (nome) => {
  const p = String(nome || '').split(/\s+/).filter(Boolean)
  return p.length <= 2 ? nome : p.slice(0, 2).join(' ')
}

export function construirBrand(tema, lead, enrich, local = null) {
  const telemovel = lead.tipo_telefone === 'telemovel'
  const prova = mostrarProvaGoogle(lead.nota, lead.reviews)
  // Morada real ou nada. Só ~25% das leads a têm; sem rua não se inventa uma.
  const morada = local?.morada
    ? [local.morada, [local.codigoPostal, local.localidade].filter(Boolean).join(' ')]
        .filter(Boolean).join(', ')
    : null
  return {
    morada,
    // Logótipo do próprio negócio, quando ele o dá. Sem ele o site usa o ícone
    // do nicho — nunca se inventa uma marca.
    logo: tema.logo ?? null,
    // A versão para fundo escuro: o cabeçalho é transparente sobre o herói até
    // o visitante rolar, e um logótipo escuro não se via lá. Sem ela a `Marca`
    // usa a normal nos dois sítios.
    logoEscuro: tema.logoEscuro ?? null,
    website: local?.website ?? null,
    sociais: local?.sociais ?? {},
    // O campo de código postal do formulário mostrava literalmente "undefined":
    // era usado no template e nunca definido aqui.
    postalPlaceholder: local?.codigoPostal ?? '1000-000',
    // Até três fotografias de quem avaliou mesmo, para o badge do Google. Sem
    // reviews com foto fica vazio e o template usa os avatares de fallback.
    avatars: (enrich?.reviews ?? []).map((r) => r.avatar).filter(Boolean).slice(0, 3),
    name: lead.nome_negocio,
    short: nomeCurto(lead.nome_negocio),
    tagline: tema.copy?.tagline ?? '',
    phoneDisplay: lead.telefone,
    phoneTel: String(lead.telefone || '').replace(/\s+/g, ''),
    phoneKind: lead.tipo_telefone,
    // Obrigatório em Portugal ao publicar um número de contacto: o consumidor
    // tem de saber o que a chamada lhe custa antes de marcar (DL 59/2021).
    // Só quando se sabe a rede. Umas poucas leads têm `tipo_telefone` 'outro' e
    // aí não se afirma um custo que não se conhece.
    phoneNote: telemovel ? 'Chamada para a rede móvel nacional'
             : lead.tipo_telefone === 'fixo' ? 'Chamada para a rede fixa nacional'
             : null,
    // telemóvel -> WhatsApp; fixo -> chamada (o botão flutuante decide por isto)
    whatsapp: telemovel ? String(lead.telefone || '').replace(/[^0-9]/g, '') : null,
    // Nos projetos Vite esta frase é escrita à mão por nicho; aqui uma app serve
    // centenas de leads, por isso constrói-se com o nome real do negócio. Sem
    // isto o link do WhatsApp saía com "?text=undefined".
    whatsappMsg: `Olá, vim pelo site da ${lead.nome_negocio} e queria pedir informações.`,
    city: lead.concelho ?? '',
    region: lead.freguesia ?? '',
    // O badge do herói e a linha das estrelas dependem de `ratingValue`. Abaixo
    // do limiar fica a zero e as duas desaparecem — o mesmo corte que o
    // `temaComDadosDaLead` faz aos pilares, para a página não dizer uma coisa
    // num sítio e outra no outro.
    rating: prova ? virgula(lead.nota) : '',
    ratingValue: prova ? Number(lead.nota) : 0,
    reviews: lead.reviews ?? 0,
    maps: lead.maps_url,
    // Reais ou ausentes — nunca inventados.
    email: enrich?.email ?? null,
    hours: horarioEmTexto(enrich?.horario),
  }
}

// Os temas referem os ícones por nome, e o template espera-os nas chaves
// ParticleIcon / Icon (maiúsculas). A resolução vive em ./icones.js, que é
// gerado com importações nomeadas: um `import * as` do lucide-react punha o
// pacote inteiro no browser.
const comIcones = (lista) => (lista ?? []).map((x) => ({ ...x, icon: icone(x.icon) }))

// Onde o formulário e o registo de cliques batem. No motor é a própria origem;
// num site ejetado o `ejetar.mjs` escreve aqui o endereço do serviço partilhado
// e desliga o rastreio.
const SERVICO_LOCAL = { api: '', site: '', rastrear: true };

export function SiteProvider({ tema, lead, enrich, cliente = null, local = null,
                               servico = SERVICO_LOCAL, basePath = '', zonas = null,
                               children }) {
  const valor = useMemo(() => {
    const reviews = Array.isArray(enrich?.reviews) ? enrich.reviews : []
    return {
      basePath,
      BRAND: construirBrand(tema, lead, enrich, local),
      NAV_LINKS: tema.nav,
      SERVICES: comIcones(tema.services),
      HERO: { ...tema.hero, ParticleIcon: icone(tema.heroParticleIcon) },
      FEATURES: tema.features,
      SHUFFLER: tema.shuffler,
      SCHEDULER: tema.scheduler,
      SIGNATURE: {
        ...tema.signature,
        header: { ...tema.signature.header, Icon: icone(tema.signature.header?.icon) },
      },
      PILLARS: tema.pillars,
      STEPS: tema.steps,
      TRUST: comIcones(tema.trust),
      COPY: tema.copy,
      // Menos de 4 avaliações reais -> secção em estado vazio, nunca preenchida
      // com ficção (PLANO.md §8.1).
      REVIEWS: reviews.length >= 4 ? reviews : [],
      // Só do próprio negócio. O tema nunca traz FAQ: um genérico do nicho não
      // responde a nada e não podia ser marcado como FAQPage.
      FAQ: (cliente?.faq ?? []).filter((f) => f?.pergunta && f?.resposta),
      // As páginas de zona. Vazias numa proposta — só um site vendido as tem —
      // e o rodapé desaparece com elas em vez de mostrar um título sem lista.
      ZONAS: Array.isArray(zonas) ? zonas : [],
      SERVICO: servico,
      LogoIcon: icone(tema.logoIcon),
    }
  }, [tema, lead, enrich, cliente, local, servico, basePath, zonas])

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}
