import React from "react";

function Carrito({ carrito, vaciarCarrito }) {
  return (
    <div className="container">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          {carrito.map((item, index) => (
            <div className="card" key={index}>
              <p>
                {item.nombre} - ${item.precio}
              </p>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button onClick={vaciarCarrito} className="btn-vaciar">
              Vaciar Carrito
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Carrito;
