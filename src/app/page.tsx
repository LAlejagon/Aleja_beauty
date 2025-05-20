'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiUser } from 'react-icons/fi';
import Image from 'next/image';
import '../styles/home.css';

// Importación de imágenes locales
import localImage1 from '@/image/banner1.jpg';
import localImage2 from '@/image/banner1.jpg';
import localImage3 from '@/image/banner1.jpg';
import placeholderImage from '@/image/banner1.jpg';

export default function HomePage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Configuración del carrusel
  const imagenesCarrusel = [
    { src: localImage1, alt: "Producto destacado 1", isRemote: false },
    { src: localImage2, alt: "Producto destacado 2", isRemote: false },
    { 
      src: "https://res.cloudinary.com/dajaq7tej/image/upload/v1743989676/paleta_rqynds.jpg", 
      alt: "Paleta de maquillaje",
      isRemote: true
    }
  ];

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    const loadProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, stock, image_url');
      if (data) setProductos(data);
    };

    loadSession();
    loadProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % imagenesCarrusel.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imagenesCarrusel.length]);

  const nextSlide = () => setCarouselIndex(prev => (prev + 1) % imagenesCarrusel.length);
  const prevSlide = () => setCarouselIndex(prev => (prev - 1 + imagenesCarrusel.length) % imagenesCarrusel.length);

  return (
    <div className="home-container">
      {/* Carrusel */}
      <div className="carousel">
        <div className="carousel-inner" style={{ transform: `translateX(-${carouselIndex * 100}%)` }}>
          {imagenesCarrusel.map((img, index) => (
            <div key={index} className="carousel-slide">
              {img.isRemote ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="carousel-image"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={process.env.NODE_ENV !== 'production'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholderImage.src;
                  }}
                />
              ) : (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="carousel-image"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
            </div>
          ))}
        </div>

        <button className="carousel-control prev" onClick={prevSlide} aria-label="Anterior">
          <FiChevronLeft size={28} />
        </button>
        
        <button className="carousel-control next" onClick={nextSlide} aria-label="Siguiente">
          <FiChevronRight size={28} />
        </button>
        
        <div className="carousel-indicators">
          {imagenesCarrusel.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === carouselIndex ? 'active' : ''}`}
              onClick={() => setCarouselIndex(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Productos */}
      <h1 className="section-title">Productos destacados</h1>

      <div className="products-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="product-card">
            <div className="product-image-container">
              {producto.image_url ? (
                <Image
                  src={producto.image_url}
                  alt={producto.name}
                  width={300}
                  height={300}
                  className="product-image"
                  loading="lazy"
                  unoptimized={!producto.image_url.includes('res.cloudinary.com') || process.env.NODE_ENV !== 'production'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = placeholderImage.src;
                  }}
                />
              ) : (
                <Image
                  src={placeholderImage}
                  alt={`Placeholder para ${producto.name}`}
                  width={300}
                  height={300}
                  className="product-image"
                />
              )}
            </div>
            <div className="product-info">
              <h3>{producto.name}</h3>
              <p className="product-price">${producto.price}</p>
              <p className={`product-stock ${producto.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {producto.stock > 0 ? (
                  <>
                    <FiShoppingCart /> Disponible
                  </>
                ) : 'Agotado'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {session && (
        <div className="admin-button">
          <Link href="/admin">
            <button>
              <FiUser /> Panel de administrador
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}