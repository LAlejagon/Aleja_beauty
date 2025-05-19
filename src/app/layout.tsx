import '../styles/global.css';
import Layout from '@/components/Layout';

export const metadata = {
  title: 'Aleja Beauty',
  description: 'Tienda de belleza en línea',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
