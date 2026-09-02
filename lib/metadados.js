// Metadados de uma demo. Partilhados pelas duas entradas: o caminho interno
// (`/nicho/negocio`, usado nas propostas) e a raiz do domínio do cliente.
import { emLocal } from './tema.js';

// 5 -> '5,0'. Sem a casa decimal saía '5 ★', que se lê como nota inteira
// e não como média — e a vírgula decimal é a convenção portuguesa.
const virgula = (n) => (n == null ? '' : Number(n).toFixed(1).replace('.', ','));

export function metadataDaDemo(demo) {
  if (!demo) return { title: 'Demonstração indisponível' };

  // Tudo o que aqui aparece é da própria lead: nome, ofício, concelho e nota reais.
  const { lead } = demo;
  // A sobrancelha do herói é a primeira linha visível da página e já traz o
  // concelho com a preposição certa. Usá-la no título faz o título coincidir
  // com o texto que está mesmo na página: antes dizia "Canalizador no Porto"
  // numa página que só falava de "canalização e eletricidade".
  const local = emLocal(lead.concelho);
  const oficio = demo.tema?.hero?.eyebrow
    ?? `${lead.oficio ? lead.oficio[0].toUpperCase() + lead.oficio.slice(1) : 'Serviços'}${local}`;
  // O nome do Maps vem inteiro — "RBAUTO (Ricardo Baptista) Reparação e
  // Manutenção Automóvel" — e num separador de browser ou num resultado do
  // Google não cabe: o Google corta o título aos ~60 caracteres e o ofício, que
  // é o que ganha o clique, era o que ficava de fora.
  const nome = demo.cliente?.nomeCurto || lead.nome_negocio;
  const titulo = `${nome} — ${oficio}`;
  const nota = lead.nota
    ? `${virgula(lead.nota)} ★ com ${lead.reviews} avaliações no Google.`
    : '';

  // A descrição do Google tem cerca de 155 caracteres. Só o ofício e a nota
  // gastavam menos de metade e não diziam o que o negócio faz. O subtítulo do
  // herói já é texto real por nicho — entra a seguir, frase a frase inteira,
  // e a nota fica no fim: uma frase que descreve o serviço ganha o clique mais
  // do que estrelas, que aqui nem chegam a aparecer como estrelas. Cada peça
  // só entra se couber, para o Google não a cortar a meio.
  const frases = (demo.tema?.hero?.sub ?? '').match(/[^.!?]+[.!?]+/g) ?? [];
  const descricao = [`${oficio}.`, ...frases.map((f) => f.trim()), nota]
    .filter(Boolean)
    .reduce((acc, p) => (acc && (`${acc} ${p}`).length > 155 ? acc : (acc ? `${acc} ${p}` : p)), '');

  // Uma demo nunca compete com a ficha Google da lead (PLANO.md §8.2). Quando o
  // negócio compra, o site passa a ser dele: sai o noindex e entra o canonical
  // do domínio próprio.
  const cliente = demo.modo === 'cliente';
  const raiz = demo.cliente?.dominio?.replace(/\/$/, '');
  // `teste: true` no site.data.json de um site ejetado: serve para validar o
  // deploy sem pôr no Google um negócio que ainda não é cliente. Tudo o resto
  // fica igual, para o teste ser do caminho a sério.
  const indexavel = cliente && !demo.teste;

  return {
    title: titulo,
    description: descricao,
    robots: indexavel ? { index: true, follow: true } : { index: false, follow: false },
    ...(cliente && raiz ? { metadataBase: new URL(raiz), alternates: { canonical: '/' } } : {}),
    openGraph: {
      title: titulo,
      description: descricao,
      type: 'website',
      locale: 'pt_PT',
      // A imagem por convenção de ficheiro resolve para a origem do pedido, não
      // para o metadataBase — no site do cliente saía o endereço do motor. Numa
      // proposta a convenção acerta sozinha e não se toca.
      ...(cliente && raiz ? {
        url: raiz,
        images: [{ url: `${raiz}/opengraph-image`, width: 1200, height: 630, alt: titulo }],
      } : {}),
    },
    twitter: { card: 'summary_large_image', title: titulo, description: descricao },
  };
}
