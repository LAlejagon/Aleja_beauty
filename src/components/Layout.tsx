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
        <div className="header-content">
          <div className="logo">
            <Link href="/">ALEJA BEAUTY</Link>
          </div>
          
          <div className="navigation">
            <Link href="/tienda">TIENDA</Link>
            <Link href="/wishlist">FAVORITOS</Link>
            <Link href="/checkout">CARRITO</Link>
            
            {user ? (
              <button onClick={handleLogout} className="logout-btn">CERRAR SESIÓN</button>
            ) : (
              <>
                <Link href="/login">INICIAR SESIÓN</Link>
                <Link href="/register">REGISTRARSE</Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="main-content">{children}</main>
      
      <footer className="footer">
        © {new Date().getFullYear()} Aleja Beauty. Todos los derechos reservados.
      </footer>
    </div>
  );
}