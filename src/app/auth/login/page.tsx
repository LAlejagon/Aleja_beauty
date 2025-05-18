'use client'
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      // Redireccionar luego de login exitoso
      router.push('/cuenta');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      <input
        className="w-full p-2 border mb-4"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 border mb-4"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={login} className="bg-pink-600 text-white px-4 py-2 w-full">
        Ingresar
      </button>
    </div>
  );
}
