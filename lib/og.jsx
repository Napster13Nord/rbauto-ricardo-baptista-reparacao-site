import { ImageResponse } from 'next/og';

// O link vai colado no WhatsApp antes da chamada. Sem imagem, sai um retângulo
// cinzento com um URL — parece spam. Com o nome e a nota reais do negócio,
// parece o que é: um site preparado para aquela pessoa.
//
// Partilhada pelas duas entradas: o caminho da proposta e a raiz do domínio do
// cliente. A etiqueta de cima é a única coisa que muda — num site vendido não
// há proposta nenhuma.
export const TAMANHO = { width: 1200, height: 630 };

const virgula = (n) => String(n ?? '').replace('.', ',');

export function imagemDaDemo(demo) {
  const ehCliente = demo?.modo === 'cliente';
  const nome = demo?.lead.nome_negocio ?? 'Demonstração';
  const cru = demo?.lead.oficio ?? '';
  const oficio = cru ? cru[0].toLocaleUpperCase('pt-PT') + cru.slice(1) : '';
  const concelho = demo?.lead.concelho ?? '';
  const nota = demo?.lead.nota;
  const cor = demo?.tema.colors?.primary ?? '#2563eb';
  const etiqueta = ehCliente
    ? [oficio, concelho].filter(Boolean).join(' · ') || 'Serviços'
    : 'Proposta de demonstração';

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', backgroundColor: '#0b0d12',
        padding: '72px 80px', color: 'white', fontFamily: 'sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, backgroundColor: cor }} />
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: 'uppercase', color: '#9aa3b2' }}>
            {etiqueta}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>{nome}</div>
          {!ehCliente && (oficio || concelho) ? (
            <div style={{ fontSize: 34, color: '#c3cad6' }}>
              {[oficio, concelho].filter(Boolean).join(' · ')}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 28, color: '#9aa3b2' }}>
          {nota ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Losango desenhado, não a estrela — a fonte do next/og não a tem
                  e saía uma caixa vazia. */}
              <div style={{ width: 18, height: 18, backgroundColor: cor, transform: 'rotate(45deg)' }} />
              <span style={{ color: 'white' }}>{virgula(nota)}</span>
              <span>· {demo.lead.reviews} avaliações no Google</span>
            </div>
          ) : null}
        </div>
      </div>
    ),
    TAMANHO,
  );
}
