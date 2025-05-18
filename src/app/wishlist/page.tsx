'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { FaHeart, FaTrash } from 'react-icons/fa';

type WishItem = {
  id: string;
  product: {
    name: string;
    price: number;
    image_url: string | null;
  };
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Debes iniciar sesión para ver tu wishlist');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id, product:product_id(name, price, image_url)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error al cargar wishlist:', error);
        setLoading(false);
        return;
      }

      // Transformar los datos para que coincidan con el tipo WishItem
      const transformedItems = data.map(item => ({
        id: item.id,
        product: item.product?.[0] || { 
          name: 'Producto no disponible', 
          price: 0, 
          image_url: null 
        }
      }));

      setItems(transformedItems);
      setLoading(false);
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase.from('wishlist_items').delete().eq('id', id);
    if (!error) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-pink-600 mb-6 flex items-center gap-2">
        <FaHeart className="text-red-500" /> Tus Favoritos
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <FaHeart className="mx-auto text-gray-300 text-5xl mb-4" />
          <p className="text-gray-500 text-lg">No tienes productos en tu lista de deseos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <div className="relative">
                <img
                  src={item.product.image_url || '/placeholder.jpg'}
                  alt={item.product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.jpg';
                  }}
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:bg-red-50 transition-colors"
                  aria-label="Eliminar de favoritos"
                >
                  <FaTrash className="text-red-500" />
                </button>
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-gray-800 line-clamp-1">{item.product.name}</h2>
                <p className="text-pink-600 font-bold mt-2">${item.product.price.toLocaleString()}</p>
                <button className="mt-3 w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md text-sm transition-colors">
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}