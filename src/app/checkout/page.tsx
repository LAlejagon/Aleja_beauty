'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: string;
  quantity: number;
  product_id: string;
  product: {
    name: string;
    price: number;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    payment_method: 'card',
    notes: '',
  });

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  useEffect(() => {
    const loadCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Debes iniciar sesión para finalizar tu compra');
        router.push('/auth/login');
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, product_id, product:product_id(name, price)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error al cargar carrito', error);
      } else {
        // Transformar los datos para que coincidan con el tipo CartItem
        const transformedItems = data.map(item => ({
          ...item,
          product: item.product?.[0] || { name: 'Producto desconocido', price: 0 }
        }));
        setItems(transformedItems as CartItem[]);
      }

      setLoading(false);
    };

    loadCart();
  }, [router]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!form.shipping_address || !form.shipping_city || !form.shipping_state) {
      alert('Por favor completa todos los campos de envío');
      return;
    }

    const { error: orderError, data: orderData } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          total_amount: total,
          status: 'processing',
          shipping_address: form.shipping_address,
          shipping_city: form.shipping_city,
          shipping_state: form.shipping_state,
          shipping_postal_code: form.shipping_postal_code,
          payment_method: form.payment_method,
          payment_status: 'pending',
          notes: form.notes,
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      console.error('Error creando pedido:', orderError);
      alert('No se pudo completar la compra');
      return;
    }

    const itemsToInsert = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error agregando productos al pedido:', itemsError);
      alert('Error interno al procesar productos');
      return;
    }

    // Limpiar carrito
    await supabase.from('cart_items').delete().eq('user_id', userId!);

    alert('Compra realizada con éxito 🎉');
    router.push('/cliente');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Finalizar compra</h1>

      {loading ? (
        <p>Cargando carrito...</p>
      ) : items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Resumen de productos</h2>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id} className="flex justify-between border-b pb-1">
                  <span>{item.product.name} (x{item.quantity})</span>
                  <span>${(item.product.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="text-right mt-4 text-lg font-bold text-pink-600">
              Total: ${total.toLocaleString()}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-xl font-semibold">Información de envío</h2>
            <input
              type="text"
              name="shipping_address"
              onChange={handleInput}
              placeholder="Dirección"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="shipping_city"
              onChange={handleInput}
              placeholder="Ciudad"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="shipping_state"
              onChange={handleInput}
              placeholder="Departamento"
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="shipping_postal_code"
              onChange={handleInput}
              placeholder="Código postal"
              className="w-full p-2 border rounded"
            />
            <textarea
              name="notes"
              placeholder="Notas del pedido (opcional)"
              onChange={handleInput}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            onClick={handleCheckout}
            className="bg-pink-600 text-white font-semibold px-6 py-3 rounded hover:bg-pink-700"
          >
            Confirmar compra
          </button>
        </>
      )}
    </div>
  );
}