'use client';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">ALEJA BEAUTY</Link>
        <div className="flex gap-4 text-sm font-medium text-dark">
          <Link href="/tienda">Tienda</Link>
          <Link href="/wishlist">Favoritos</Link>
          <Link href="/checkout">Carrito</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-white text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} Aleja Beauty. Todos los derechos reservados.
      </footer>
    </div>
  );
}
