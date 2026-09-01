// As seis paletas que a lead pode experimentar na barra da demo.
//
// Vive ao lado do `lib/cores.js` e pela mesma razão: as páginas do site
// importam isto, e nada aqui pode arrastar a base de dados — um site ejetado
// é estático e leva este ficheiro com ele.
//
// Todas as combinações foram medidas contra os fundos onde são usadas e
// passam AA (4,5:1). Os alvos são estes, e são os que o template usa:
//
//   primary       fundo de botão com texto branco     -> vs #FFFFFF
//   primaryDark   texto sobre o fundo claro da página -> vs #FAFAFA
//   primaryLight  texto sobre o fundo escuro do herói -> vs #101010
//   accent        fundo de etiqueta com texto branco  -> vs #FFFFFF
//   accentDark    texto sobre o fundo claro da página -> vs #FAFAFA
//
// Mexer num destes valores obriga a repetir a medição. O `rgb` do tema não
// entra aqui: é derivado em `variaveisDoTema`.

export const PALETAS = [
  { id: 'ouro', nome: 'Ouro velho',
    primary: '#8C6B24', primaryDark: '#8A6B22', primaryLight: '#DCC07C',
    accent: '#7A5C8F', accentDark: '#5C4470' },

  { id: 'oceano', nome: 'Oceano',
    primary: '#1F6F9E', primaryDark: '#15547A', primaryLight: '#7FBDDD',
    accent: '#26766A', accentDark: '#1F6659' },

  { id: 'floresta', nome: 'Floresta',
    primary: '#2E7A4F', primaryDark: '#1F5A39', primaryLight: '#86C9A2',
    accent: '#96622C', accentDark: '#8A5A28' },

  { id: 'grafite', nome: 'Grafite',
    primary: '#4A5560', primaryDark: '#333C45', primaryLight: '#9BA7B3',
    accent: '#B05A3C', accentDark: '#8A422A' },

  { id: 'vinho', nome: 'Vinho',
    primary: '#9B3245', primaryDark: '#77202F', primaryLight: '#D68B99',
    accent: '#4A6B8A', accentDark: '#35506B' },

  { id: 'tinta', nome: 'Tinta da china',
    primary: '#3D4CA8', primaryDark: '#2B3781', primaryLight: '#95A0DD',
    accent: '#A85B28', accentDark: '#9B5528' },
];

export const paleta = (id) => PALETAS.find((p) => p.id === id) ?? null;
