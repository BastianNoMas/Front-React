import React from "react";

function Carrito({ carrito }) {
  return (
    <div className="container">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div>
          {carrito.map((item, index) => (
            <div className="card" key={index}>
              <p>
                {item.nombre} - ${item.precio}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Carrito;
