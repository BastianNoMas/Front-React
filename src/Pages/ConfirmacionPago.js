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
        return;
      }

      try {
        const response = await fetch(`http://localhost:3010/api/webpay/confirmacion-pago?token_ws=${token}`);
        const data = await response.json();

        if (data.response && data.response.status === 'AUTHORIZED') {
          setMensaje('¡Compra realizada exitosamente!');
          setConfirmado(true);

          const productosComprados = location.state?.productos || [];
          console.log('Productos comprados:', productosComprados);

          if (productosComprados.length > 0) {
            const stockRes = await fetch('http://localhost:3010/api/descontar-stock', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productos: productosComprados }),
            });

            if (!stockRes.ok) {
              const errorData = await stockRes.json();
              throw new Error(errorData.mensaje || 'Error al descontar el stock');
            }

            console.log('Stock descontado correctamente');
          }
        } else {
          setMensaje('El pago no fue autorizado');
        }
      } catch (error) {
        console.error('Error al confirmar el pago:', error);
        setMensaje(`Error al confirmar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    };

    confirmarPago();
  }, [location.search]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{mensaje}</h1>
      {confirmado && <p>Gracias por tu compra. Tu pedido está siendo procesado.</p>}
    </div>
  );
};

export default ConfirmacionPago;
