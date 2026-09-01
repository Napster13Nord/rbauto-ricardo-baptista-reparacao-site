import './globals.css';
import { CLASSES_FONTES } from '../lib/fontes';

export const metadata = {
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg', apple: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-PT" className={CLASSES_FONTES}>
      <body>{children}</body>
    </html>
  );
}
