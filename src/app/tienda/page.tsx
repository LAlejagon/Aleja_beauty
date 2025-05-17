'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        setError(error.message);
      } else {
        setProducts(data ?? []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center mt-20">Cargando productos...</div>;

  if (error) return <div className="text-center mt-20 text-red-600">Error: {error}</div>;

  if (products.length === 0) return <div className="text-center mt-20">No hay productos disponibles.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Listado de Productos</h1>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="border rounded p-4 flex flex-col items-center shadow hover:shadow-lg transition"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4 rounded">
                Sin imagen
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            {product.description && (
              <p className="text-gray-600 text-sm mb-2 text-center">{product.description}</p>
            )}
            <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
