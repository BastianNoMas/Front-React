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

  const handlePagar = async () => {
    if (!valorDolar || carrito.length === 0) return;

    try {
      const buyOrder = `orden_${Date.now()}`;
      const sessionId = `sesion_${Date.now()}`;
      const amount = totalCLP;

      const response = await axios.post("http://localhost:3001/api/pago/crear", {
        amount,
        sessionId,
        buyOrder,
      });

      const { url, token } = response.data;

      // Crear formulario y redirigir automáticamente a Webpay
      const form = document.createElement("form");
      form.method = "POST";
      form.action = url;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "token_ws";
      input.value = token;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
      alert("Hubo un problema al iniciar el pago.");
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
            <button onClick={vaciarCarrito} className="btn-vaciar">
              Vaciar Carrito
            </button>
            <button onClick={handlePagar} className="btn-pagar" style={{ marginTop: "10px", marginLeft: "10px" }}>
              Pagar con Webpay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;
