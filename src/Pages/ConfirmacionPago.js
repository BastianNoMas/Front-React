import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ConfirmacionPago = () => {
  const location = useLocation();

  useEffect(() => {
    // Optimiza la lógica para descontar el stock de los productos comprados
    const descontarStock = async () => {
      try {
        const productosComprados = location.state?.productos || [];
        if (productosComprados.length > 0) {
          const response = await fetch('/api/descontar-stock', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productos: productosComprados }),
          });

          if (!response.ok) {
            throw new Error('Error al descontar el stock');
          }

          console.log('Stock descontado correctamente');
        }
      } catch (error) {
        console.error('Error al descontar el stock:', error);
      }
    };

    descontarStock();
  }, [location.state]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>¡Compra realizada exitosamente!</h1>
      <p>Gracias por tu compra. Tu pedido está siendo procesado.</p>
    </div>
  );
};

export default ConfirmacionPago;