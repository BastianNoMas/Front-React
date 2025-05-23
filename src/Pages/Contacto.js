import React, { useState } from "react";
import axios from "axios";

function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEnviado(false);

    // Aquí puedes enviar los datos al backend si tienes un endpoint
    // Ejemplo: await axios.post("http://TU_BACKEND/api/contacto", form);

    // Simulación de envío exitoso
    setTimeout(() => {
      setEnviado(true);
      setForm({ nombre: "", email: "", mensaje: "" });
    }, 1000);
  };

  return (
    <div className="container">
      <h2>Contacto con un Vendedor</h2>
      <form onSubmit={handleSubmit} className="form-contacto">
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mensaje:</label>
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Enviar</button>
      </form>
      {enviado && <p style={{ color: "green" }}>¡Mensaje enviado correctamente!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Contacto;