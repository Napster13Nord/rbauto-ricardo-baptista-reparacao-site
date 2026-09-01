// Cores do tema como canais RGB, para as variáveis CSS que o Tailwind consome.
//
// Vive fora do `lib/demos.js` de propósito: as páginas do site importam isto, e
// o `demos.js` arrasta a ligação à base de dados e os 14 temas. Num site ejetado
// — estático, sem servidor nem Postgres — nada disso pode entrar no pacote.

// Hex -> "184 115 14"
export function canais(hex) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(hex).trim());
  if (!m) return '0 0 0';
  return [1, 2, 3].map((i) => parseInt(m[i], 16)).join(' ');
}

export function variaveisDoTema(cores) {
  return {
    '--primary': canais(cores.primary),
    '--primary-dark': canais(cores.primaryDark),
    '--primary-light': canais(cores.primaryLight),
    '--accent': canais(cores.accent),
    '--accent-dark': canais(cores.accentDark),
  };
}
