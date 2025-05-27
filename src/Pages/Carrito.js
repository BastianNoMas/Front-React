import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

function Carrito({ carrito, vaciarCarrito }) {
  const [valorDolar, setValorDolar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener el valor del dólar desde la API chilena
  useEffect(() => {
    axios
      .get("https://mindicador.cl/api/dolar")
      .then((res) => {
        const valor = res.data.serie[0].valor;
        setValorDolar(valor);
      })
      .catch((err) => console.error("Error al obtener el dólar:", err));
  }, []);

  // Calcular totales
  const totalCLP = carrito.reduce((acc, item) => acc + Number(item.precio), 0);
  const totalUSD = valorDolar ? (totalCLP / valorDolar).toFixed(2) : null;

  // Al hacer clic en "Pagar"
  const handlePagar = async () => {
    if (!valorDolar || carrito.length === 0) {
      alert("No hay productos en el carrito o no se pudo obtener el valor del dólar");
      return;
    }
    setIsLoading(true);

    try {
      const buyOrder = `orden_${Date.now()}`;
      const sessionId = `sesion_${Math.random().toString(36).substring(2, 15)}`;
      const returnUrl = `${window.location.origin}/confirmacion-pago`;

      // Llamar al endpoint de creación de transacción
      const response = await axios.post("http://localhost:3010/api/webpay/create", {
        buyOrder,
        sessionId,
        amount: totalCLP,
        returnUrl,
      });

      // Redirigir al usuario a WebPay
      window.location.href = `${response.data.url}?token_ws=${response.data.token}`;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      let errorMessage = "Ocurrió un error al procesar el pago";

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Carrito de Compras</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <div className="carrito-box">
          {carrito.map((item, index) => (
            <div
              className="card item-carrito"
              key={index}
              style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
            >
              {item.imagen && (
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    marginRight: "10px",
                    borderRadius: "4px",
                  }}
                />
              )}
              <div>
                <span>{item.nombre}</span> -{" "}
                <span>${Number(item.precio).toLocaleString("es-CL")} CLP</span>
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
            <button onClick={handlePagar} className="btn-pagar" disabled={isLoading}>
              {isLoading ? "Procesando..." : "Pagar con WebPay"}
            </button>
            <button onClick={vaciarCarrito} className="btn-vaciar" style={{ marginLeft: "10px" }}>
              Vaciar Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Define PropTypes for validation
Carrito.propTypes = {
  carrito: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      precio: PropTypes.number.isRequired,
      imagen: PropTypes.string,
    })
  ).isRequired,
  vaciarCarrito: PropTypes.func.isRequired,
};

export default Carrito;