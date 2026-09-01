import './globals.css';
import { CLASSES_FONTES } from '../lib/fontes';

export const metadata = {
  icons: { icon: '/logos/rbauto-ricardo-baptista-reparacao-41405716.png', shortcut: '/logos/rbauto-ricardo-baptista-reparacao-41405716.png', apple: '/logos/rbauto-ricardo-baptista-reparacao-41405716.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT" className={CLASSES_FONTES}>
      <body>{children}</body>
    </html>
  );
}
