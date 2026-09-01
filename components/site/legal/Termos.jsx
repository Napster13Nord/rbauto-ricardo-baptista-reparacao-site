'use client'
// GERADO por scripts/port-app.mjs a partir de _gerador/tpl/Termos.jsx — não editar à mão.
import LegalLayout from './LegalLayout'
import { useSite } from '../SiteContext'

export default function Termos() {
  const { BRAND, basePath } = useSite()
  return (
    <LegalLayout title="Termos e Condições" updated="agosto de 2026">
      <section>
        <h2>1. Âmbito</h2>
        <p>
          Estes termos aplicam-se à utilização deste site e aos pedidos submetidos através dele a{' '}
          {BRAND.name}.
        </p>
      </section>

      <section>
        <h2>2. Orçamentos</h2>
        <p>
          Os pedidos submetidos no site não constituem um contrato. Qualquer valor indicado por
          telefone ou email antes da avaliação do trabalho é estimativo. O orçamento vinculativo é
          entregue por escrito e tem validade de 30 dias.
        </p>
      </section>

      <section>
        <h2>3. Execução dos trabalhos</h2>
        <p>
          Os trabalhos são executados por profissionais habilitados, de acordo com as regras
          técnicas aplicáveis. Datas de execução podem ser ajustadas por indisponibilidade de
          material ou condições no local, sendo sempre comunicadas ao cliente.
        </p>
      </section>

      <section>
        <h2>4. Garantias</h2>
        <p>
          Os trabalhos e materiais beneficiam das garantias previstas na lei portuguesa. A garantia
          não cobre danos resultantes de utilização indevida, falta de manutenção ou intervenção de
          terceiros.
        </p>
      </section>

      <section>
        <h2>5. Pagamentos</h2>
        <p>
          As condições de pagamento são as indicadas no orçamento aceite pelo cliente. É emitida
          fatura com IVA à taxa legal em vigor.
        </p>
      </section>

      <section>
        <h2>6. Resolução de litígios</h2>
        <p>
          Em caso de litígio de consumo, o consumidor pode recorrer a uma entidade de resolução
          alternativa de litígios. Mais informação em{' '}
          <a href="https://www.consumidor.gov.pt" target="_blank" rel="noopener noreferrer">
            consumidor.gov.pt
          </a>
          .
        </p>
      </section>

      <section>
        <h2>7. Contacto</h2>
        <p>
          Para qualquer esclarecimento: {BRAND.phoneDisplay} ·{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
        </p>
      </section>
    </LegalLayout>
  )
}
