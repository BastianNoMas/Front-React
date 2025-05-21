import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./Pages/Home";
import Carrito from "./Pages/Carrito";
import Navbar from "./Componentes/Navbar";

function App() {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [valorDolar, setValorDolar] = useState(null);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    setMensaje(`✅ ${producto.nombre} ha sido agregado al carrito de compras`);
    setTimeout(() => setMensaje(""), 3000);
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
    setMensaje("🗑️ Carrito vaciado correctamente");
    setTimeout(() => setMensaje(""), 3000);
  };

  useEffect(() => {
    axios
      .get("https://mindicador.cl/api/dolar")
      .then((response) => {
        const valor = response.data.serie[0].valor;
        setValorDolar(valor);
      })
      .catch((error) => {
        console.error("Error al obtener el valor del dólar", error);
      });
  }, []);

  return (
    <Router>
      <Navbar />

      {mensaje && <div className="mensaje-alerta">{mensaje}</div>}

      <Routes>
        <Route
          path="/"
          element={<Home agregarAlCarrito={agregarAlCarrito} />}
        />
        <Route
          path="/carrito"
          element={
            <Carrito
              carrito={carrito}
              setCarrito={setCarrito}
              vaciarCarrito={vaciarCarrito}
            />
          }
        />
      </Routes>

      <footer
        style={{
          marginTop: "40px",
          padding: "15px",
          textAlign: "center",
          backgroundColor: "#f1f1f1",
          color: "#333",
          borderTop: "1px solid #ccc",
          fontWeight: "bold",
        }}
      >
        💵 Valor del dólar hoy:{" "}
        {valorDolar
          ? `$${valorDolar.toLocaleString("es-CL", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} CLP`
          : "Cargando..."}
      </footer>
    </Router>
  );
}

export default App;
