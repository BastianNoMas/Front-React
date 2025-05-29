// ConfirmacionPago.tsx

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmacionPago = () => {
  const location = useLocation();
  const [mensaje, setMensaje] = useState('Procesando...');
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    const confirmarPago = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token_ws');

      if (!token) {
        setMensaje('Token no proporcionado');
        localStorage.removeItem('pendingPurchaseCart'); // Limpiar si no hay token
        return;
      }

      try {
        const response = await fetch(`http://localhost:3010/api/webpay/confirmacion-pago?token_ws=${token}`);
        const data = await response.json();

        if (data.response && data.response.status === 'AUTHORIZED') {
          setMensaje('¡Compra realizada exitosamente!');
          setConfirmado(true);
          localStorage.setItem('paymentProcessed', 'true'); // Señal para App.js

          // Recuperar el carrito desde localStorage
          const pendingCartJSON = localStorage.getItem('pendingPurchaseCart');
          localStorage.removeItem('pendingPurchaseCart'); // Limpiar el carrito pendiente

          if (pendingCartJSON) {
            let productosComprados = [];
            try {
              productosComprados = JSON.parse(pendingCartJSON);
            } catch (e) {
              console.error("Error al parsear pendingPurchaseCart desde localStorage", e);
              setMensaje(prev => `${prev} (Advertencia: no se pudo procesar la lista de productos para el stock)`);
            }
            
            console.log('Productos comprados (desde localStorage):', productosComprados);

            if (productosComprados.length > 0) {
              try {
                const stockRes = await fetch('http://localhost:3003/api/stock/descontar-stock', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  // Asegúrate que tu backend espera un objeto { productos: [...] }
                  // y que cada producto en el array tiene un 'id'.
                  body: JSON.stringify({ productos: productosComprados }),
                });

                if (!stockRes.ok) {
                  const errorData = await stockRes.json();
                  const stockErrorMessage = errorData.mensaje || 'Error al descontar el stock';
                  console.error('Error al descontar el stock:', stockErrorMessage);
                  setMensaje(prev => `${prev}. Problema al actualizar stock: ${stockErrorMessage}`);
                } else {
                  console.log('Stock descontado correctamente');
                  // Opcional: setMensaje(prev => `${prev} y el stock ha sido actualizado.`);
                }
              } catch (stockError) {
                console.error('Error en la llamada para descontar el stock:', stockError);
                const stockErrorMessage = stockError instanceof Error ? stockError.message : 'Error desconocido en descuento de stock';
                setMensaje(prev => `${prev}. Problema al actualizar stock: ${stockErrorMessage}`);
              }
            }
          } else {
            console.warn('No se encontró el carrito pendiente en localStorage para descontar stock, pero el pago fue exitoso.');
            setMensaje(prev => `${prev} (Advertencia: no se encontró información del carrito para actualizar stock)`);
          }
        } else {
          setMensaje(data.message || 'El pago no fue autorizado por Webpay.');
          localStorage.removeItem('pendingPurchaseCart'); // Limpiar en caso de fallo de pago
        }
      } catch (error) {
        console.error('Error al confirmar el pago:', error);
        setMensaje(`Error al confirmar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    };

    confirmarPago();
  // location.search es una dependencia adecuada. location es de useLocation().
  }, [location]); 

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{mensaje}</h1>
      {confirmado && <p>Gracias por tu compra. Tu pedido está siendo procesado.</p>}
    </div>
  );
};

export default ConfirmacionPago;
