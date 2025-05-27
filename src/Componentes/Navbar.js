import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirige a una página de resultados de búsqueda, por ejemplo /?q=busqueda
    if (busqueda.trim()) {
      navigate(`/?q=${encodeURIComponent(busqueda)}`);
      setBusqueda("");
    }
  };

  return (
    <nav>
      <Link to="/">Home</Link> FERREMAS
      <Link to="/carrito">Carrito</Link>
      <Link to="/contacto">Contacto</Link>
      <form onSubmit={handleSubmit} style={{ display: "inline", marginLeft: "20px" }}>
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ marginRight: "5px" }}
        />
        <button type="submit">Buscar</button>
      </form>
    </nav>
  );
}

export default Navbar;