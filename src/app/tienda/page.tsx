'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string | null;
  stock: number;
};

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, description, image_url, stock')
        .eq('status', 'active');

      if (error) {
        console.error('Error al cargar productos:', error.message);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('Debes iniciar sesión para agregar al carrito.');
      return;
    }

    // Corrección aquí: usar el formato correcto para upsert
    const { error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        },
        {
          onConflict: 'user_id,product_id', // Esto debe ser una cadena, no un array
        }
      );

    if (error) {
      alert('Error al agregar al carrito.');
      console.error(error);
    } else {
      alert('Producto agregado al carrito 🛒');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">Catálogo de Productos</h1>

      {loading ? (
        <p className="text-center text-gray-500">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No hay productos disponibles por ahora.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded shadow hover:shadow-lg transition">
              <img
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-pink-500 font-bold">${product.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="mt-2 bg-pink-600 text-white text-sm px-4 py-2 rounded hover:bg-pink-700"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}