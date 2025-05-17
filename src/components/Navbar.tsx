import Link from 'next/link';
import { FaShoppingCart, FaUserCircle, FaSearch } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-serif font-bold text-pink-600 hover:text-pink-700 transition-colors">
          ALEJA BEAUTY
        </Link>

        {/* Menú central */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/tienda" className="text-gray-800 hover:text-pink-600 transition-colors font-medium">
            Tienda
          </Link>
          <Link href="/servicios" className="text-gray-800 hover:text-pink-600 transition-colors font-medium">
            Servicios
          </Link>
          <Link href="/nosotros" className="text-gray-800 hover:text-pink-600 transition-colors font-medium">
            Nosotros
          </Link>
          <Link href="/blog" className="text-gray-800 hover:text-pink-600 transition-colors font-medium">
            Blog
          </Link>
        </div>

        {/* Iconos derecha */}
        <div className="flex gap-6 items-center">
          <button className="text-gray-700 hover:text-pink-600 transition-colors">
            <FaSearch size={18} />
          </button>
          <Link href="/cuenta" className="text-gray-700 hover:text-pink-600 transition-colors">
            <FaUserCircle size={20} />
          </Link>
          <Link href="/carrito" className="text-gray-700 hover:text-pink-600 transition-colors relative">
            <FaShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}