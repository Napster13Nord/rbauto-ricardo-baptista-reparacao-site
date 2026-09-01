import { SiteProvider } from './SiteContext';
import Privacidade from './legal/Privacidade';
import Termos from './legal/Termos';
import FaixaDemo from './FaixaDemo';
import { variaveisDoTema } from '../../lib/cores';

// As duas páginas legais, servidas do caminho da proposta e da raiz do domínio
// do cliente. O rodapé de todas as demos liga-lhes desde o início.
export const PAGINAS = {
  privacidade: { Componente: Privacidade, titulo: 'Política de Privacidade' },
  termos: { Componente: Termos, titulo: 'Termos e Condições' },
};

export default function PaginaLegal({ demo, qual, basePath }) {
  const { tema, lead, enrich, cliente, local, modo, zonas } = demo;
  const { Componente } = PAGINAS[qual];

  return (
    <>
      <style>{`:root{${Object.entries(variaveisDoTema(tema.colors))
        .map(([k, v]) => `${k}:${v}`).join(';')}}`}</style>
      <SiteProvider tema={tema} lead={lead} enrich={enrich} cliente={cliente} local={local}
                    basePath={basePath} zonas={zonas}>
        <Componente />
      </SiteProvider>
      {modo === 'cliente' ? null : <FaixaDemo />}
    </>
  );
}

// Repetidas em centenas de sites, estas páginas não acrescentam nada ao que se
// procura — nunca se indexam, nem no site do cliente.
export function metadataLegal(demo, qual) {
  const pagina = PAGINAS[qual];
  if (!pagina) return {};
  return {
    title: demo ? `${pagina.titulo} — ${demo.lead.nome_negocio}` : pagina.titulo,
    robots: { index: false, follow: true },
  };
}
