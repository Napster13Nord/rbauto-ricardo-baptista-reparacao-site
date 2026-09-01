// As quatro letras de origem, servidas pelo próprio site em vez do Google.
//
// A folha do `fonts.googleapis.com` era um pedido que bloqueava o desenho da
// página: 780 ms de 4G lento antes de aparecer o primeiro pixel, mais uma
// segunda ligação ao `fonts.gstatic.com` para os ficheiros. O `next/font`
// descarrega-as no build e serve-as do mesmo domínio — zero pedidos a
// terceiros e zero bloqueio.
//
// `preload: false` nas quatro de propósito. A maior imagem da página é o herói,
// e é ele que decide o LCP; pré-carregar sete ficheiros de letra roubava-lhe
// largura de banda logo no início. Com `display: 'swap'` o texto aparece na
// letra do sistema e troca quando a real chega — que é exatamente o que já
// acontecia antes, só que mais cedo.
//
// Três destas são variáveis (um ficheiro cobre todos os pesos); a Cormorant
// Garamond não é, e por isso leva pesos e estilos explícitos.
import { Plus_Jakarta_Sans, Cormorant_Garamond, Inter, JetBrains_Mono } from 'next/font/google';

const display = Plus_Jakarta_Sans({
  subsets: ['latin'], variable: '--font-display', display: 'swap', preload: false,
});

const serif = Cormorant_Garamond({
  subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'],
  variable: '--font-serif', display: 'swap', preload: false,
});

const body = Inter({
  subsets: ['latin'], variable: '--font-body', display: 'swap', preload: false,
});

const mono = JetBrains_Mono({
  subsets: ['latin'], variable: '--font-mono', display: 'swap', preload: false,
});

// Vai no `<html>` para as variáveis caírem no `:root`, que é onde o
// `globals.css` as lê.
export const CLASSES_FONTES = `${display.variable} ${serif.variable} ${body.variable} ${mono.variable}`;
