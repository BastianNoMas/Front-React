import React, { useEffect, useState } from "react";
import axios from "axios";

function Carrito({ carrito, vaciarCarrito }) {
  const [valorDolar, setValorDolar] = useState(null);

  useEffect(() => {
    axios
      .get("https://mindicador.cl/api/dolar")
      .then((res) => {
        const valor = res.data.serie[0].valor;
        setValorDolar(valor);
      })
      .catch((err) => console.error("Error al obtener el dólar:", err));
  }, []);

  const totalCLP = carrito.reduce((acc, item) => acc + Number(item.precio), 0);
  const totalUSD = valorDolar ? (totalCLP / valorDolar).toFixed(2) : null;

  return (
    <div className="container">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="carrito-box">
          {carrito.map((item, index) => (
            <div className="card item-carrito" key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              {item.imagen && (
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  style={{
                    width: '50px', // Ancho pequeño
                    height: '50px', // Alto pequeño
                    objectFit: 'cover', // Para que la imagen se ajuste bien sin distorsionarse
                    marginRight: '10px', // Espacio entre la imagen y el texto
                    borderRadius: '4px' // Bordes redondeados opcionales
                  }}
                />
              )}
              <div>
                <span>{item.nombre}</span> - <span>${Number(item.precio).toLocaleString("es-CL")} CLP</span>
                {/* Puedes quitar los minimumFractionDigits si prefieres no mostrar centavos para precios enteros */}
              </div>
            </div>
          ))}

          <div className="carrito-total" style={{ marginTop: "15px" }}>
            <strong>Total:</strong> ${totalCLP.toLocaleString("es-CL", { maximumFractionDigits: 0 })}{" "}
            CLP
            {totalUSD && (
              <div>
                <strong>Total USD:</strong> ${totalUSD} USD
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button onClick={vaciarCarrito} className="btn-vaciar">
              Vaciar Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;