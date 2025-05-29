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

  const handleAgregarAlCarritoConValidacion = async (producto) => {
    if (!producto.id) {
      alert('El producto no tiene un ID válido para verificar el stock.');
      return;
    }

    try {
      // 1. Validar stock llamando a tu API backend
      // Usamos producto.id, que ya mapeaste para que sea el 'codigo' del stock.
      // Asegúrate que el puerto y la ruta base sean correctos para tu API de stock.
      // Basado en ConfirmacionPago.js, el API de stock podría estar en el puerto 3003.
      const response = await axios.get(`http://localhost:3003/api/stock/validar/${producto.id}`);

      if (response.data && response.data.cantidad > 0) {
        // 2. Si hay stock, llamar a la función original para agregar al carrito
        agregarAlCarrito(producto); // Esta función ya muestra su propio mensaje de éxito
        // alert(`${producto.nombre} ha sido agregado al carrito.`); // Redundante si agregarAlCarrito ya notifica
      } else {
        // El producto existe en la tabla de stock, pero la cantidad es 0 o no se encontró cantidad
        alert(`Lo sentimos, ${producto.nombre} está actualmente fuera de stock.`);
      }
    } catch (error) {
      console.error('Error al validar stock:', error);
      if (error.response && error.response.status === 404) {
        alert(`El producto ${producto.nombre} no se encontró en nuestro inventario o no tiene stock registrado.`);
      } else {
        alert('No se pudo verificar el stock del producto en este momento. Por favor, inténtalo más tarde.');
      }
    }
  };

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
            <button onClick={() => handleAgregarAlCarritoConValidacion(producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
