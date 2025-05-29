import React, { useEffect, useState } from "react";
import axios from "axios";

function Home({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);
  const [valorDolar, setValorDolar] = useState(null);

  useEffect(() => {
    // Petición a tu backend
    axios.get('http://localhost:3000/api/productos') // al momento de presentar se cambia la ip .
      .then(response => {
        // Asegurarnos de que cada producto tenga una propiedad 'id'.
        // Si viene 'codigo' del backend y no 'id', lo mapeamos.
        const productosConId = response.data.map(producto => ({
          ...producto,
          id: producto.id || producto.codigo, // Usar producto.id si existe, sino producto.codigo
        }));
        setProductos(productosConId);
      })
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
          // Ahora podemos usar producto.id con seguridad para el key,
          // ya que nos aseguramos de que exista.
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
