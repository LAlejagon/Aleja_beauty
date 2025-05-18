import '@/styles/home.css';

export default function HomePage() {
  return (
    <section className="home-hero">
      <div className="hero-content">
        <h1>Bienvenida a Aleja Beauty 💄</h1>
        <p>Productos seleccionados con amor para realzar tu belleza única.</p>
        <a href="/tienda" className="shop-button">Explorar tienda</a>
      </div>
    </section>
  );
}
