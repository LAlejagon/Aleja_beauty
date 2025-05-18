'use client';
import Link from 'next/link';
import '@/styles/layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="logo">ALEJA BEAUTY</div>
        <nav className="nav">
          <Link href="/">Inicio</Link>
          <Link href="/tienda">Tienda</Link>
          <Link href="/wishlist">Favoritos</Link>
          <Link href="/checkout">Carrito</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        © {new Date().getFullYear()} Aleja Beauty. Todos los derechos reservados.
      </footer>
    </div>
  );
}
