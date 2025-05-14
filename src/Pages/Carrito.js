import React from "react";

function Carrito({ carrito, vaciarCarrito }) {
  // Calcular total
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="container">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="carrito-box">
          {carrito.map((item, index) => (
            <div className="card item-carrito" key={index}>
              <p>
                {item.nombre} - ${item.precio}
              </p>
            </div>
          ))}

          <div className="carrito-total">
            <strong>Total:</strong> ${total}
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
