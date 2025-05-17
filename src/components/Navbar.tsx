import Link from 'next/link';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-pink-600">ALEJA BEAUTY</Link>

      <div className="flex gap-4 items-center">
        <Link href="/tienda" className="text-gray-700 hover:text-pink-600">Tienda</Link>
        <Link href="/cuenta" className="text-gray-700 hover:text-pink-600">
          <FaUserCircle size={24} />
        </Link>
        <Link href="/carrito" className="text-gray-700 hover:text-pink-600">
          <FaShoppingCart size={24} />
        </Link>
      </div>
    </nav>
  );
}
