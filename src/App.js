import "./App.css";
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Home from "./Pages/Home";
import Carrito from "./Pages/Carrito";
import Navbar from "./Componentes/Navbar";
import Contacto from "./Pages/Contacto";
import ConfirmacionPago from './Pages/ConfirmacionPago';

function AppInternal() {
  const [carrito, setCarrito] = useState([]);
  const location = useLocation(); // Para el efecto de limpieza del carrito
  const [mensaje, setMensaje] = useState("");
  const [valorDolar, setValorDolar] = useState(null);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (e) {
        console.error("Error al parsear el carrito desde localStorage", e);
        localStorage.removeItem("carrito"); // Limpiar dato corrupto
      }
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // useCallback para estabilizar la referencia de la función si se pasa como dependencia
  const vaciarCarritoHandler = useCallback(() => {
    setCarrito([]);
    // localStorage.removeItem("carrito"); // El useEffect [carrito] lo actualizará a []
                                         // Opcionalmente, para remoción inmediata:
    localStorage.removeItem("carrito"); 
    setMensaje("🗑️ Carrito vaciado correctamente");
    setTimeout(() => setMensaje(""), 3000);
  }, []); // No hay dependencias, por lo que es estable

  const agregarAlCarrito = (producto) => {
    if (!producto.id) {
      console.error("Intento de agregar producto sin ID:", producto);
      setMensaje(`❌ Error: El producto "${producto.nombre}" no tiene un ID y no puede ser agregado.`);
      setTimeout(() => setMensaje(""), 4000);
      return;
    }
    setCarrito([...carrito, producto]);
    setMensaje(`✅ ${producto.nombre} ha sido agregado al carrito de compras`);
    setTimeout(() => setMensaje(""), 3000);
  };

  // Efecto para verificar pago exitoso y limpiar carrito
  useEffect(() => {
    const paymentProcessedFlag = localStorage.getItem('paymentProcessed');
    if (paymentProcessedFlag === 'true') {
      if (carrito.length > 0) {
        console.log('Pago procesado detectado. Vaciando carrito.');
        vaciarCarritoHandler();
      }
      localStorage.removeItem('paymentProcessed'); // Limpiar la señal
    }
  }, [location.pathname, carrito.length, vaciarCarritoHandler]);

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
    <>
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
              vaciarCarrito={vaciarCarritoHandler}
            />
          }
        />
        <Route
          path="/contacto"
          element={<Contacto />}
        />
         <Route path="/confirmacion-pago" element={<ConfirmacionPago />} />
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
    </>
  );
}

function App() {
  return (
    <Router>
      <AppInternal />
    </Router>
  );
}
export default App;