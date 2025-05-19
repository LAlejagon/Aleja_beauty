'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrorMsg('Correo o contraseña incorrectos');
    } else {
      router.push('/tienda');
    }
  };

  return (
    <div className="auth">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        {errorMsg && <p className="error">{errorMsg}</p>}
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <Link href="/register">Regístrate</Link></p>
    </div>
  );
}
