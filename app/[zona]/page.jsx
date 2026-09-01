import PaginaZona, { metadataZona } from '../../components/site/PaginaZona';
import dados from '../../site.data.json';

export const dynamic = 'force-static';

const zonas = dados.zonas ?? [];
const daZona = (caminho) => zonas.find((z) => z.caminho === caminho);

export function generateStaticParams() {
  return zonas.map((z) => ({ zona: z.caminho }));
}

export async function generateMetadata({ params }) {
  const { zona } = await params;
  const z = daZona(zona);
  return z ? metadataZona(dados, z) : {};
}

export default async function Pagina({ params }) {
  const { zona } = await params;
  const z = daZona(zona);
  // Com output: 'export' só se constroem os caminhos que generateStaticParams
  // devolve, por isso isto não acontece. Mas um undefined aqui dava um ecrã
  // branco sem erro nenhum, e um notFound() seria uma dependência a mais.
  // Cuidado com crases neste comentário: está dentro de um template literal
  // e uma crase fecha-o.
  if (!z) return null;
  return <PaginaZona demo={dados} zona={z} basePath="" servico={dados.servico} />;
}
