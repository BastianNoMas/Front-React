import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Home from './Home'; // Ajusta la ruta si es necesario

// Simular axios
jest.mock('axios');

describe('Home Component - Obtención de Productos', () => {
  const mockAgregarAlCarrito = jest.fn();

  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    axios.get.mockReset();
    // Es importante también simular la llamada a la API del dólar que ocurre en el mismo useEffect,
    // para aislar la prueba de la obtención de productos.
    axios.get.mockImplementation((url) => {
      if (url === 'https://mindicador.cl/api/dolar') {
        return Promise.resolve({ data: { serie: [{ valor: 900 }] } });
      }
      // Dejar que otras URLs fallen o se manejen específicamente si es necesario
      return Promise.reject(new Error(`Unhandled GET request to ${url}`));
    });
  });

  test('debería obtener y mostrar los productos correctamente', async () => {
    const mockProductos = [
      { id: '1', nombre: 'Producto Test 1', precio: 15000, imagen: 'test1.jpg' },
      { id: '2', nombre: 'Producto Test 2', precio: 25000, imagen: 'test2.jpg' },
    ];

    // Configurar la simulación específica para la URL de productos
    axios.get.mockImplementation(url => {
      if (url === 'http://localhost:3000/api/productos') {
        return Promise.resolve({ data: mockProductos });
      }
      if (url === 'https://mindicador.cl/api/dolar') {
        return Promise.resolve({ data: { serie: [{ valor: 900 }] } });
      }
      return Promise.reject(new Error(`Unhandled GET request to ${url}`));
    });

    render(<Home agregarAlCarrito={mockAgregarAlCarrito} />);

    // Esperar a que los productos se muestren
    await waitFor(() => {
      expect(screen.getByText('Producto Test 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Producto Test 1')).toBeInTheDocument();
    expect(screen.getByText(`Precio: $${mockProductos[0].precio.toLocaleString("es-CL")} CLP`)).toBeInTheDocument();
    expect(screen.getByText('Producto Test 2')).toBeInTheDocument();
    expect(screen.getByText(`Precio: $${mockProductos[1].precio.toLocaleString("es-CL")} CLP`)).toBeInTheDocument();

    // Verificar que axios.get fue llamado para obtener los productos
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/productos');
  });

  test('debería manejar un error al obtener los productos', async () => {
    // Configurar la simulación para que falle la obtención de productos
    axios.get.mockImplementation(url => {
      if (url === 'http://localhost:3000/api/productos') {
        return Promise.reject(new Error('Error de API'));
      }
      if (url === 'https://mindicador.cl/api/dolar') {
        return Promise.resolve({ data: { serie: [{ valor: 900 }] } });
      }
      return Promise.reject(new Error(`Unhandled GET request to ${url}`));
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Home agregarAlCarrito={mockAgregarAlCarrito} />);

    // Esperar a que el error sea manejado (en este caso, logueado)
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener productos:', expect.any(Error));
    });

    // Opcional: Verificar que no se muestren productos
    expect(screen.queryByText('Producto Test 1')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
