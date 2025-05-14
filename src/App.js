import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Carrito from "./Pages/Carrito";
import Navbar from "./Componentes/Navbar";

function App() {
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    setMensaje(`✅ ${producto.nombre} ha sido agregado al carrito de compras`);

    setTimeout(() => {
      setMensaje("");
    }, 3000); // mensaje desaparece después de 3 segundos
  };

  return (
    <Router>
      <Navbar />

      {/* Mostrar mensaje si existe */}
      {mensaje && <div className="mensaje-alerta">{mensaje}</div>}

      <Routes>
        <Route
          path="/"
          element={<Home agregarAlCarrito={agregarAlCarrito} />}
        />
        <Route path="/carrito" element={<Carrito carrito={carrito} />} />
      </Routes>
    </Router>
  );
}
export default App;
