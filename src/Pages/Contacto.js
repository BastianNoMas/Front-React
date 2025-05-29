import React, { useState } from "react";
import emailjs from "@emailjs/browser";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setEnviado(false);

    const serviceID = "service_t9jpsm5";
    const templateToMeID = "template_xetmhf1";
    const templateAutoReplyID = "template_kwt9tvc";
    const publicKey = "vZ5IJvUyNisgr_NPv";

    const templateParams = {
      name: form.nombre,
      email: form.email,
      message: form.mensaje,
    };

    // Enviar a ti
    emailjs.send(serviceID, templateToMeID, templateParams, publicKey)
      .then(() => {
        console.log("Mensaje enviado a ti ✅");

        // Auto-reply al usuario
        emailjs.send(serviceID, templateAutoReplyID, templateParams, publicKey)
          .then(() => {
            console.log("Auto-reply enviado ✅");
            setEnviado(true);
            setForm({ nombre: "", email: "", mensaje: "" });
          })
          .catch((error) => {
            console.error("Error en auto-reply:", error);
            setError("Error al enviar la respuesta automática.");
          });
      })
      .catch((error) => {
        console.error("Error al enviarte el mensaje:", error);
        setError("Error al enviar el mensaje.");
      });
  };

  return (
    <div className="container form-box">
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
