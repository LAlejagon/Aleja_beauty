'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import '@/styles/layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setSession(user);
    };
    getSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push('/login');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="logo">
          <Link href="/">ALEJA BEAUTY</Link>
        </div>
        <nav className="nav">
          <Link href="/tienda">Tienda</Link>
          <Link href="/wishlist">Favoritos</Link>
          <Link href="/checkout">Carrito</Link>
          {session && <Link href="/admin">Admin</Link>}
          {session ? (
            <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
          ) : (
            <>
              <Link href="/login">Iniciar sesión</Link>
              <Link href="/register">Registrarse</Link>
            </>
          )}
        </nav>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        © {new Date().getFullYear()} Aleja Beauty. Todos los derechos reservados.
      </footer>
    </div>
  );
}
