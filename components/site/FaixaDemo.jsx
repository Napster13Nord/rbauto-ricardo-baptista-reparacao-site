// Faixa obrigatória em todas as demos (PLANO.md §8.3): quem abrir o link tem de
// perceber, sem ambiguidade, que isto é uma proposta e não o site do negócio.
const CONTACTO = process.env.NEXT_PUBLIC_CONTACTO ?? '';

export default function FaixaDemo() {
  return (
    <div className="relative z-40 bg-deep px-4 py-3 text-center">
      <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/70">
        Proposta de demonstração · site de exemplo, não é o site oficial deste negócio
        {CONTACTO ? <span className="text-white/50"> · {CONTACTO}</span> : null}
      </p>
    </div>
  );
}
