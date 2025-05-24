import React, { useEffect, useState } from "react";
import axios from "axios";

function Home({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [valorDolar, setValorDolar] = useState(null);

  useEffect(() => {
    // Petición a tu backend
    axios.get('http://192.168.1.8:3000/api/productos') // al momento de presentar se cambia la ip .
      .then(response => setProductos(response.data))
      .catch(error => console.error('Error al obtener productos:', error));

    // Petición a la API externa
    axios.get('https://mindicador.cl/api/dolar')
      .then(response => {
        const valor = response.data.serie[0].valor;
        setValorDolar(valor);
      })
      .catch(error => console.error('Error al obtener el valor del dólar:', error));
  }, []);

  return (
    <div className="container">
      <h2>Catálogo</h2>
      
      <div className="product-grid">
        {productos.map((producto) => (
          <div className="card" key={producto.id}>
              {producto.imagen && (
              <img src={producto.imagen} alt={producto.nombre} style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }} />
            )}
            <h3>{producto.nombre}</h3>
            <p>Precio: ${producto.precio.toLocaleString("es-CL")} CLP</p>
            {valorDolar && (
              <p>USD aprox: ${(producto.precio / valorDolar).toFixed(2)} USD</p>
            )}
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
