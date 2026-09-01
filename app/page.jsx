import PaginaDemo from '../components/site/PaginaDemo';
import { metadataDaDemo } from '../lib/metadados';
import dados from '../site.data.json';

export const metadata = metadataDaDemo(dados);

export default function Pagina() {
  return <PaginaDemo demo={dados} basePath="" servico={dados.servico} />;
}
