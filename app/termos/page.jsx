import PaginaLegal, { metadataLegal } from '../../components/site/PaginaLegal';
import dados from '../../site.data.json';

export const metadata = metadataLegal(dados, 'termos');

export default function Pagina() {
  return <PaginaLegal demo={dados} qual="termos" basePath="" />;
}
