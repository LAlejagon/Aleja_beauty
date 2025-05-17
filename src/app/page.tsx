'use client'
import { useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function Home() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      console.log('test supabase:', data, error);
    };
    test();
  }, []);

  return <div className="text-center mt-20">Prueba de conexión con Supabase</div>;
}
