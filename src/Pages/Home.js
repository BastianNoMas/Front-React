import React, { useEffect, useState } from "react";
import axios from "axios";

function Home({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Petición a tu API Express
    axios.get('http://localhost:3000/api/productos')
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener productos:', error));
  }, []);

  return (
    <div className="container">
      <h2>Catálogo</h2>
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
