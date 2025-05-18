'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

export default function AdminPage() {
  const [accessAllowed, setAccessAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        setAccessAllowed(true);
      } else {
        router.push('/unauthorized'); // puedes hacer una página bonita para esto
      }
    };

    checkAdmin();
  }, [router]);

  if (!accessAllowed) return null;

  return (
    <div>
      <h1>Panel de Administración</h1>
      {/* aquí irá el contenido de admin */}
    </div>
  );
}
