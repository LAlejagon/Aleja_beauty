'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import '@/styles/layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };

    checkRole();
  }, []);

  return (
    <div className="layout">
      <header className="header">
        <div className="logo">ALEJA BEAUTY</div>
        <nav className="nav">
          <Link href="/">Inicio</Link>
          <Link href="/tienda">Tienda</Link>
          <Link href="/wishlist">Favoritos</Link>
          <Link href="/checkout">Carrito</Link>
          {isAdmin && <Link href="/admin">Admin</Link>}
        </nav>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        © {new Date().getFullYear()} Aleja Beauty. Todos los derechos reservados.
      </footer>
    </div>
  );
}
