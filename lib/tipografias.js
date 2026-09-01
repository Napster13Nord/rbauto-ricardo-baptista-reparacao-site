// As quatro combinações de letra que a lead pode experimentar na barra da demo.
//
// São quatro e não seis de propósito. Uma paleta custa cinco variáveis CSS;
// uma combinação de letra custa três ou quatro famílias descarregadas. Seis
// combinações carregadas à cabeça juntavam algumas centenas de kB à página, e
// a velocidade é meio argumento de venda. Por isso: quatro, e a folha de
// estilo de cada uma só é pedida quando a lead a escolhe.
//
// ---------------------------------------------------------------------------
// O `estilo` é o que faz as quatro parecerem mesmo diferentes
// ---------------------------------------------------------------------------
// Trocar só as famílias deixava as quatro com o mesmo desenho: todos os títulos
// partidos ao meio, primeira metade em sans, segunda em serif itálico. Mudava a
// letra e não mudava o ar da página.
//
//   'dividido'  o título parte-se em duas letras — a segunda metade sai em
//               `--fonte-serif`, em itálico, um pouco maior. É o desenho de
//               origem do site.
//   'unico'     o título inteiro numa letra só: a segunda metade passa a usar
//               `--fonte-display`, sem itálico. A ênfase fica na cor e no peso,
//               não na troca de família.
//
// O mesmo mecanismo dá dois resultados muito diferentes conforme a família que
// estiver em `display`: uma serif dá um título inteiramente serifado; uma sans
// geométrica dá um título limpo de uma ponta à outra. As regras que fazem isto
// estão no `globals.css`, presas ao atributo `data-titulo` do documento.

export const TIPOGRAFIAS = [
  {
    id: 'original',
    nome: 'Original',
    estilo: 'dividido',
    resumo: 'Título em duas letras',
    // Estas quatro vêm do `next/font` pelo `lib/fontes.js`, servidas do próprio
    // domínio; o nome real da família é gerado no build, por isso referem-se
    // pela variável e não pelo nome.
    display: 'var(--font-display)',
    serif: 'var(--font-serif)',
    body: 'var(--font-body)',
    mono: 'var(--font-mono)',
    // Vazio porque o layout já as carrega — trocar de volta não pede nada à rede.
    href: '',
  },
  {
    // Título inteiro numa serif com carácter. É a que muda mais a página.
    id: 'editorial',
    nome: 'Editorial',
    estilo: 'unico',
    resumo: 'Título todo serifado',
    display: '"Fraunces"',
    serif: '"Fraunces"',
    body: '"Source Sans 3"',
    mono: '"IBM Plex Mono"',
    href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Source+Sans+3:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap',
  },
  {
    // O oposto: título limpo de uma ponta à outra, sem serif nenhuma.
    id: 'moderno',
    nome: 'Moderno',
    estilo: 'unico',
    resumo: 'Título todo numa sans',
    display: '"Outfit"',
    serif: '"Outfit"',
    body: '"DM Sans"',
    mono: '"Space Mono"',
    href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap',
  },
  {
    // Volta ao título partido, mas com uma serif de traço grosso em vez da
    // Cormorant, que é fina. Mesmo desenho da original, carácter oposto.
    id: 'oficina',
    nome: 'Oficina',
    estilo: 'dividido',
    resumo: 'Título em duas letras, traço grosso',
    display: '"Archivo"',
    serif: '"Lora"',
    body: '"Public Sans"',
    mono: '"Roboto Mono"',
    href: 'https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Lora:ital,wght@1,500;1,600&family=Public+Sans:wght@300;400;500;600&family=Roboto+Mono:wght@400;500&display=swap',
  },
];

export const tipografia = (id) => TIPOGRAFIAS.find((t) => t.id === id) ?? TIPOGRAFIAS[0];

// As mesmas quatro famílias de reserva em todo o lado: se a folha do Google
// falhar, a página continua a ler-se com o que o sistema tem.
export const RESERVA = {
  display: 'system-ui, sans-serif',
  serif: 'Georgia, serif',
  body: 'system-ui, sans-serif',
  mono: 'ui-monospace, monospace',
};

export function variaveisDaTipografia(t) {
  return {
    '--fonte-display': `${t.display}, ${RESERVA.display}`,
    '--fonte-serif': `${t.serif}, ${RESERVA.serif}`,
    '--fonte-body': `${t.body}, ${RESERVA.body}`,
    '--fonte-mono': `${t.mono}, ${RESERVA.mono}`,
  };
}
