import PaginaLegal, { metadataLegal } from '../../components/site/PaginaLegal';
import dados from '../../site.data.json';

export const metadata = metadataLegal(dados, 'privacidade');

export default function Pagina() {
  return <PaginaLegal demo={dados} qual="privacidade" basePath="" />;
}
