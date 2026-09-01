'use client'
// GERADO por scripts/port-app.mjs a partir de _gerador/tpl/PoliticaPrivacidade.jsx — não editar à mão.
import LegalLayout from './LegalLayout'
import { useSite } from '../SiteContext'

export default function PoliticaPrivacidade() {
  const { BRAND, SERVICO, basePath } = useSite()
  return (
    <LegalLayout title="Política de Privacidade" updated="agosto de 2026">
      <section>
        <h2>1. Quem trata os seus dados</h2>
        <p>
          Os dados pessoais recolhidos através deste site são tratados por {BRAND.name}, com
          atividade em {BRAND.city}, {BRAND.region}. Para qualquer questão relacionada com
          privacidade pode contactar-nos por email para{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a> ou pelo telefone{' '}
          {BRAND.phoneDisplay}.
        </p>
      </section>

      <section>
        <h2>2. Que dados recolhemos</h2>
        <p>
          Apenas os dados que nos fornece voluntariamente no formulário de contacto: nome, email,
          telemóvel, código postal, a descrição do pedido e, opcionalmente, fotografias que decida
          anexar.
        </p>
      </section>

      <section>
        <h2>3. Para que usamos os dados</h2>
        <p>
          Os dados são usados exclusivamente para responder ao seu pedido, agendar o serviço e
          prestar o trabalho contratado. Não são usados para marketing sem o seu consentimento
          expresso nem vendidos ou cedidos a terceiros.
        </p>
      </section>

      <section>
        <h2>4. Durante quanto tempo</h2>
        <p>
          Pedidos que não resultem em contrato são eliminados no prazo de 12 meses. Dados associados
          a serviços prestados são conservados pelo período exigido pela legislação fiscal
          portuguesa.
        </p>
      </section>

      <section>
        <h2>5. Os seus direitos</h2>
        <p>
          Nos termos do RGPD, pode solicitar o acesso, a retificação, o apagamento ou a limitação do
          tratamento dos seus dados, bem como opor-se a esse tratamento. Basta enviar um pedido para{' '}
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>. Tem também o direito de apresentar
          reclamação junto da Comissão Nacional de Proteção de Dados (CNPD).
        </p>
      </section>

      <section>
        <h2>6. Cookies</h2>
        <p>
          Este site não utiliza cookies de publicidade nem de rastreio de terceiros. São utilizados
          apenas os recursos técnicos necessários ao funcionamento das páginas.
        </p>
      </section>

      {/* Ligar a medição sem o dizer aqui tornava esta página falsa. Só aparece
          quando há mesmo medição. */}
      {SERVICO.rastrear ? (
        <section>
          <h2>7. Medição de visitas</h2>
          <p>
            Registamos as páginas abertas e os cliques nos botões de telefone e de WhatsApp, para
            percebermos se o site está a ser útil. <strong>Não são guardados cookies nem qualquer
            outra informação no seu equipamento</strong>, e não usamos serviços de análise de
            terceiros.
          </p>
          <p>
            De cada visita guardamos apenas a página, a data, o nome do site de onde veio, o
            identificador do navegador, o tempo que esteve na página, o país e a localidade, e um
            código irreversível calculado a partir do endereço IP — que serve para não contar a
            mesma pessoa duas vezes e não permite identificá-la. O endereço IP em si nunca é
            guardado.
          </p>
          <p>
            A localidade vem da rede por onde se liga e é aproximada: diz o concelho, não a morada.
            Do site de onde veio guardamos só o nome — <em>google.com</em>, por exemplo — e nunca o
            endereço completo, que poderia conter aquilo que pesquisou. Estes registos são apagados
            ao fim de 12 meses e servem apenas para o resumo mensal de visitas do negócio.
          </p>
        </section>
      ) : null}
    </LegalLayout>
  )
}
