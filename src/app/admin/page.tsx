'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { FaClipboardList, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import ProductForm from '@/components/admin/ProductForm';
import EditProductForm from '@/components/admin/EditProductForm';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Acceso denegado');
        window.location.href = '/';
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        alert('Acceso restringido solo para administradores');
        window.location.href = '/';
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, stock, status')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error cargando productos:', error.message);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };

    checkAdminAndLoad();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-pink-600">
        <FaClipboardList /> Panel de Administración
      </h1>

      <div className="mb-6">
        <button
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
          onClick={() => setShowForm(true)}
        >
          <FaPlus /> Nuevo Producto
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p>No hay productos aún.</p>
      ) : (
        <table className="w-full text-left border">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Estado</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{prod.name}</td>
                <td className="p-2">${prod.price.toLocaleString()}</td>
                <td className="p-2">{prod.stock}</td>
                <td className="p-2 capitalize">{prod.status}</td>
                <td className="p-2 flex gap-3 justify-center">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => setEditProductId(prod.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={async () => {
                      if (confirm('¿Estás seguro de eliminar este producto?')) {
                        const { error } = await supabase
                          .from('products')
                          .delete()
                          .eq('id', prod.id);
                        if (error) {
                          alert('Error al eliminar');
                          console.error(error);
                        } else {
                          alert('Producto eliminado');
                          window.location.reload();
                        }
                      }
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para crear producto */}
      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSuccess={() => window.location.reload()}
        />
      )}

      {/* Modal para editar producto */}
      {editProductId && (
        <EditProductForm
          productId={editProductId}
          onClose={() => setEditProductId(null)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
}
