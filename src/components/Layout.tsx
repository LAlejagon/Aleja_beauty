'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import '@/styles/layout.css';


type SessionUser = {
  id: string;
  email: string;
  role: string;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setUser({
          id: user.id,
          email: user.email ?? '',
          role: profile?.role ?? 'customer',
        });
      } else {
        setUser(null);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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

          {user?.role === 'admin' && <Link href="/admin">Admin</Link>}
          {user && <Link href="/perfil">Perfil</Link>}

          {user ? (
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
