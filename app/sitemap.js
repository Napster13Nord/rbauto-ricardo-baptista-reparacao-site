import dados from '../site.data.json';

export const dynamic = 'force-static';

export default function sitemap() {
  const raiz = dados.cliente.dominio.replace(/\/$/, '');
  const agora = new Date();
  // Com trailingSlash o site serve /privacidade/ — o sitemap tem de anunciar
  // exatamente o endereço que existe, senão aponta para um redireccionamento.
  const fixas = ['/', '/privacidade/', '/termos/'].map((p) => ({
    url: `${raiz}${p}`,
    lastModified: agora,
    changeFrequency: p === '/' ? 'monthly' : 'yearly',
    priority: p === '/' ? 1 : 0.3,
  }));

  // As páginas de zona valem quase tanto como a inicial: são elas que apanham
  // quem procura o ofício com o nome da terra.
  const zonas = (dados.zonas ?? []).map((z) => ({
    url: `${raiz}/${z.caminho}/`,
    lastModified: agora,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...fixas, ...zonas];
}
