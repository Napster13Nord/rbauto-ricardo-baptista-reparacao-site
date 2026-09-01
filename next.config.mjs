/** @type {import('next').NextConfig} */
export default {
  // HTML pré-renderizado, sem servidor. É isto que faz o site ser indexável sem
  // depender de o crawler executar JavaScript.
  output: 'export',
  // O optimizador de imagens precisa de servidor; as imagens já vêm
  // dimensionadas pelo srcset do template.
  images: { unoptimized: true },
  // Gera out/privacidade/index.html — servido tal e qual por qualquer nginx,
  // sem precisar de regras de reescrita.
  trailingSlash: true,
  // A folha de estilo era o último pedido a travar o desenho da página: o
  // browser tinha de a ir buscar antes de pintar o primeiro pixel. Num site de
  // três páginas não há nada a ganhar em mantê-la em ficheiro à parte — o
  // cache entre páginas não compensa uma ida à rede na primeira visita.
  experimental: { inlineCss: true },
};
