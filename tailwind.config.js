/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-dark': 'rgb(var(--primary-dark) / <alpha-value>)',
        'primary-light': 'rgb(var(--primary-light) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-dark': 'rgb(var(--accent-dark) / <alpha-value>)',
        background: '#F9F9F9',
        surface: '#FFFFFF',
        ink: '#1A1A1A',
        muted: '#6A6A6A',
        divider: '#E0E0E0',
        deep: '#0F1419',
      },
      // As quatro famílias passam por variáveis pela mesma razão que as cores
      // já passavam: é o que deixa a barra da demo trocar a combinação de letra
      // sem recarregar a página nem construir o Tailwind outra vez. O valor por
      // omissão está no globals.css e é a combinação original.
      fontFamily: {
        display: ['var(--fonte-display)'],
        serif: ['var(--fonte-serif)'],
        body: ['var(--fonte-body)'],
        mono: ['var(--fonte-mono)'],
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '4rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        blink: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
}