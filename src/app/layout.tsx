import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'ALEJA BEAUTY',
  description: 'Tienda de productos de belleza',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
