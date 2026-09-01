import './globals.css';
import { CLASSES_FONTES } from '../lib/fontes';

export const metadata = {
  icons: { icon: '/logos/rbauto-ricardo-baptista-reparacao.png', shortcut: '/logos/rbauto-ricardo-baptista-reparacao.png', apple: '/logos/rbauto-ricardo-baptista-reparacao.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT" className={CLASSES_FONTES}>
      <body>{children}</body>
    </html>
  );
}
