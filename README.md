# Ferremas - Frontend React

## Descripción

**Ferremas** es una aplicación web para la gestión y compra de productos de ferretería. Permite a los usuarios buscar productos, agregarlos a un carrito de compras persistente, consultar stock en tiempo real, realizar pagos y contactar a un vendedor.

---

## Características

- **Catálogo de productos** con búsqueda por nombre.
- **Carrito de compras** persistente usando `localStorage`.
- **Consulta de stock** en el backend antes de agregar productos al carrito.
- **Conversión de precios** a dólares usando una API externa.
- **Formulario de contacto** para enviar mensajes a un vendedor.
- **Integración con WebPay** para pagos (simulado).
- **Diseño responsive** y moderno.

---

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/ferremas.git
   cd Ferremas/Front-React
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno** si tu backend requiere configuración especial.

4. **Inicia la aplicación:**
   ```bash
   npm start
   ```

---

## Estructura de Carpetas

```
src/
  ├── App.js
  ├── App.css
  ├── Componentes/
  │     └── Navbar.js
  ├── Pages/
  │     ├── Home.js
  │     ├── Carrito.js
  │     ├── Contacto.js
  │     └── ConfirmacionPago.js
  └── ...
```

---

## Principales Componentes

- **Navbar:** Barra de navegación con enlaces y buscador.
- **Home:** Muestra los productos y permite buscar.
- **Carrito:** Visualiza y gestiona los productos seleccionados.
- **Contacto:** Formulario para contactar a un vendedor.
- **ConfirmacionPago:** Página de confirmación tras el pago.

---

## Funcionalidades Técnicas

- **Búsqueda:**  
  El buscador en el navbar redirige a la página principal con el término de búsqueda en la URL. `Home.js` consulta la API del backend usando ese término.

- **Carrito Persistente:**  
  El carrito se guarda en `localStorage` y se sincroniza automáticamente.

- **Consulta de Stock:**  
  Antes de agregar un producto al carrito, se consulta el stock en el backend.

- **Conversión de Moneda:**  
  El valor del dólar se obtiene de [mindicador.cl](https://mindicador.cl/) y se muestra en el footer.

- **Formulario de Contacto:**  
  Permite enviar mensajes a un vendedor (puedes conectar con tu backend o usar EmailJS).

---

## Personalización

- Cambia la URL del backend en los archivos donde se hace consulta a la API (`Home.js`, `Carrito.js`, etc.).
- Personaliza los estilos en [`src/App.css`](src/App.css).

---

## Dependencias

- React
- React Router DOM
- Axios
- EmailJS (opcional, para el formulario de contacto)

Instala con:
```bash
npm install react-router-dom axios @emailjs/browser
```

---

## Notas

- Asegúrate de que el backend esté corriendo y acepte peticiones desde el frontend.
- Si usas rutas diferentes o necesitas autenticación, ajusta los endpoints en los componentes correspondientes.
- Puedes agregar más páginas o funcionalidades según tus necesidades.
