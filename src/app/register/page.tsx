'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/register.css';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [names, setNames] = useState('');
  const [lastnames, setLastnames] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: names,
          last_name: lastnames
        }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="auth">
      <h1>Crear cuenta</h1>
      <form onSubmit={handleRegister}>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Nombres"
          value={names}
          onChange={(e) => setNames(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Apellidos"
          value={lastnames}
          onChange={(e) => setLastnames(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarme</button>
      </form>
      <p>¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>
    </div>
  );
}
