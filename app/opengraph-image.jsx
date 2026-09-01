import dados from '../site.data.json';
import { TAMANHO, imagemDaDemo } from '../lib/og';

export const dynamic = 'force-static';
export const size = TAMANHO;
export const contentType = 'image/png';
export const alt = dados.lead.nome_negocio;

export default function Imagem() {
  return imagemDaDemo(dados);
}
