import '../styles/global.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aleja Beauty',
  description: 'Tienda de maquillaje y belleza',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
