import React from "react";

function Home({ agregarAlCarrito }) {
  const productos = [
    { id: 1, nombre: "Producto A", precio: 10 },
    { id: 2, nombre: "Producto B", precio: 15 },
    { id: 3, nombre: "Producto C", precio: 20 },
    { id: 4, nombre: "Producto D", precio: 25 },
    { id: 5, nombre: "Producto E", precio: 30 },
    { id: 6, nombre: "Producto F", precio: 12 },
    { id: 7, nombre: "Producto G", precio: 18 },
    { id: 8, nombre: "Producto H", precio: 22 },
    { id: 9, nombre: "Producto I", precio: 27 },
    { id: 10, nombre: "Producto J", precio: 35 },
    { id: 11, nombre: "Producto K", precio: 40 },
    { id: 12, nombre: "Producto L", precio: 45 },
    { id: 13, nombre: "Producto M", precio: 50 },
    { id: 14, nombre: "Producto N", precio: 55 },
    { id: 15, nombre: "Producto O", precio: 60 },
    { id: 15, nombre: "Producto P", precio: 65 },
  ];

  return (
    <div className="container">
      <h2>Catalogo</h2>
      <div className="product-grid">
        {productos.map((producto) => (
          <div className="card" key={producto.id}>
            <h3>{producto.nombre}</h3>
            <p>Precio: ${producto.precio}</p>
            <button onClick={() => agregarAlCarrito(producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
