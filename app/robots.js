import dados from '../site.data.json';

export const dynamic = 'force-static';

export default function robots() {
  // Um deploy de teste não entra no Google: o negócio ainda não é cliente e o
  // site competiria com a ficha Google dele.
  if (dados.teste) return { rules: [{ userAgent: '*', disallow: '/' }] };

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${dados.cliente.dominio.replace(/\/$/, '')}/sitemap.xml`,
  };
}
