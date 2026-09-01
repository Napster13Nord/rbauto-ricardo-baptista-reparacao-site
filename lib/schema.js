// Dados estruturados LocalBusiness, por nicho.
//
// Duas regras que este ficheiro não quebra:
//
// 1. Não inventa. Sem morada real não emite PostalAddress — emite areaServed,
//    que é o que representa honestamente quem trabalha em casa do cliente.
//    Sem coordenadas não emite geo. Sem horário não emite horário.
//
// 2. Não marca aggregateRating. As avaliações são do Google e a marcação seria
//    auto-referente: o Google não mostra estrelas assim e trata a prática como
//    enganosa. As avaliações continuam visíveis na página, apenas não marcadas.

// O subtipo diz ao Google que tipo de negócio é. Onde não existe subtipo
// próprio (carpintaria, serralharia, vidraçaria, eletrodomésticos), fica
// HomeAndConstructionBusiness em vez de se forçar um tipo errado.
const TIPO = {
  '01-cabeleireiro': 'HairSalon',
  '02-barbearia': 'BarberShop',
  '03-reparacao-de-eletrodomesticos': 'HomeAndConstructionBusiness',
  '04-vidraceiro': 'HomeAndConstructionBusiness',
  '05-eletricista': 'Electrician',
  '06-chaveiro': 'Locksmith',
  '07-carpinteiro': 'HomeAndConstructionBusiness',
  '08-canalizador': 'Plumber',
  '09-climatizacao': 'HVACBusiness',
  '10-remodelacoes': 'GeneralContractor',
  '11-pintor': 'HousePainter',
  '12-oficina-auto': 'AutoRepair',
  '13-serralheiro': 'HomeAndConstructionBusiness',
  '14-salao-de-beleza': 'BeautySalon',
};

const DIAS = {
  seg: 'Monday', ter: 'Tuesday', qua: 'Wednesday', qui: 'Thursday',
  sex: 'Friday', sab: 'Saturday', dom: 'Sunday',
};

// {seg:"08:00 – 20:00"} -> [{@type, dayOfWeek, opens, closes}]
// Dias fechados e "24 horas" não entram: o primeiro é ausência de horário, o
// segundo precisava de opens/closes que não temos com esse texto.
function horario(h) {
  if (!h || typeof h !== 'object') return null;
  const out = [];
  for (const [dia, texto] of Object.entries(h)) {
    if (!DIAS[dia]) continue;
    const m = /(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/.exec(String(texto));
    if (!m) continue;
    out.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${DIAS[dia]}`,
      opens: m[1], closes: m[2],
    });
  }
  return out.length ? out : null;
}

/** O subtipo schema.org deste ofício. Partilhado com as páginas de zona, para
 *  as duas não dizerem que o mesmo negócio é de dois tipos. */
export const tipoDoNicho = (nicho) => TIPO[nicho] ?? 'LocalBusiness';

export function localBusiness({ lead, enrich, local, cliente, url, imagem, logotipo }) {
  const dados = {
    '@context': 'https://schema.org',
    '@type': tipoDoNicho(lead.nicho),
    // O nome da entidade, para as páginas de zona lhe poderem apontar em vez de
    // declararem cada uma o seu negócio. Sem isto o Google via um negócio novo
    // por página: doze empresas na mesma morada, com o mesmo telefone.
    ...(cliente?.dominio ? { '@id': `${cliente.dominio.replace(/\/$/, '')}/#negocio` } : {}),
    name: lead.nome_negocio,
    url,
    telephone: String(lead.telefone ?? '').replace(/\s+/g, ''),
  };

  if (cliente?.email || enrich?.email) dados.email = cliente?.email ?? enrich.email;
  if (cliente?.fundadoEm) dados.foundingDate = String(cliente.fundadoEm);

  // Morada real ou nada. O concelho entra como área servida em qualquer caso —
  // é verdadeiro mesmo para quem só trabalha em casa do cliente.
  if (local?.morada && local?.codigoPostal) {
    dados.address = {
      '@type': 'PostalAddress',
      streetAddress: local.morada,
      postalCode: local.codigoPostal,
      addressLocality: local.localidade ?? lead.concelho ?? undefined,
      addressCountry: 'PT',
    };
  }

  if (local?.lat != null && local?.lng != null) {
    dados.geo = { '@type': 'GeoCoordinates', latitude: local.lat, longitude: local.lng };
  }

  const areas = cliente?.areasServidas?.length
    ? cliente.areasServidas
    : [lead.concelho].filter(Boolean);
  if (areas.length) {
    dados.areaServed = areas.map((n) => ({ '@type': 'AdministrativeArea', name: n }));
  }

  const oh = horario(enrich?.horario);
  if (oh) dados.openingHoursSpecification = oh;

  // A ficha do Google e as redes que o negócio tem mesmo.
  const sameAs = [lead.maps_url, ...Object.values(local?.sociais ?? {})].filter(Boolean);
  if (sameAs.length) dados.sameAs = sameAs;

  // Só a fotografia do próprio negócio, que vive em `/fotos/`. O herói por
  // omissão de um nicho é uma imagem de banco partilhada por todas as leads
  // desse nicho: marcá-la como `image` seria dizer ao Google que aquela
  // oficina é a deste cliente. Sem foto própria, o campo não existe.
  if (imagem?.startsWith('/fotos/')) dados.image = `${url}${imagem}`;

  // O logótipo é campo próprio e não substitui o `image`: o Google usa a
  // fotografia nos resultados locais e o logótipo no painel de conhecimento.
  // Pôr o logótipo no `image` não seria falso, mas gastava o campo errado — e
  // a maioria dos clientes dá logótipo mesmo quando não dá fotografias.
  if (logotipo?.startsWith('/')) dados.logo = `${url}${logotipo}`;

  return dados;
}

// FAQPage só existe se houver perguntas reais dadas pelo cliente.
export function faqPage(faq) {
  const uteis = (faq ?? []).filter((f) => f?.pergunta && f?.resposta);
  if (!uteis.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: uteis.map((f) => ({
      '@type': 'Question',
      name: f.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: f.resposta },
    })),
  };
}
