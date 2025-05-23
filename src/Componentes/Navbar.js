import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> FERREMAS<Link to="/carrito">Carrito</Link><Link to="/contacto">Contacto</Link>
    </nav>
  );
}

export default Navbar;
