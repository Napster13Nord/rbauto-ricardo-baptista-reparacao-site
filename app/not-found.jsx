import Link from 'next/link';
import dados from '../site.data.json';
import { variaveisDoTema } from '../lib/cores';

export const metadata = { title: `Página não encontrada — ${dados.lead.nome_negocio}` };

export default function NaoEncontrada() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      {/* Concatenação em vez de template literal aninhada: este ficheiro é
          gerado, e o aninhamento obrigava a escapes que vazavam para o output. */}
      <style>{`:root{${Object.entries(variaveisDoTema(dados.tema.colors))
        .map(([k, v]) => k + ':' + v).join(';')}}`}</style>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary-dark">Erro 404</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tighter text-ink sm:text-5xl">
        Esta página não existe.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        O endereço pode estar mal copiado. Volte ao início ou ligue-nos para{' '}
        {dados.lead.telefone}.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/25">
          Voltar ao início
        </Link>
        <a href={`tel:${String(dados.lead.telefone).replace(/\\s+/g, '')}`}
           className="inline-flex items-center gap-2 rounded-full border border-divider px-6 py-3 font-semibold text-ink">
          Ligar agora
        </a>
      </div>
    </main>
  );
}
