import '../styles/home.css';

export default function HomePage() {
  return (
    <div className="home">
      <h1>Bienvenido a Aleja Beauty 💄</h1>
      <p>Descubre productos de belleza y cuidado personal</p>
      <a href="/tienda" className="go-shop">Ir a la tienda</a>
    </div>
  );
}
