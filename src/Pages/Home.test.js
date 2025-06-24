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
    axios.get.mockReset();
  });

  test('debería mostrar los productos correctamente', async () => {
    const mockProductos = [
      { id: 1, nombre: 'Producto Test 1', precio: 1000 },
      { id: 2, nombre: 'Producto Test 2', precio: 2000 },
    ];
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

    await waitFor(() => {
      expect(screen.getByText('Producto Test 1')).toBeInTheDocument();
      expect(screen.getByText(`Precio: $${mockProductos[0].precio.toLocaleString("es-CL")} CLP`)).toBeInTheDocument();
      expect(screen.getByText('Producto Test 2')).toBeInTheDocument();
      expect(screen.getByText(`Precio: $${mockProductos[1].precio.toLocaleString("es-CL")} CLP`)).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/productos');
  });

  test('debería manejar un error al obtener los productos', async () => {
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

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error al obtener productos:', expect.any(Error));
    });

    expect(screen.queryByText('Producto Test 1')).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  test('debería manejar un error al obtener el valor del dólar', async () => {
    axios.get.mockImplementation(url => {
      if (url === 'http://localhost:3000/api/productos') {
        return Promise.resolve({ data: [] });
      }
      if (url === 'https://mindicador.cl/api/dolar') {
        return Promise.reject(new Error('Error de API Dólar'));
      }
      return Promise.reject(new Error(`Unhandled GET request to ${url}`));
    });

    render(<Home agregarAlCarrito={mockAgregarAlCarrito} />);

    await waitFor(() => {
      expect(screen.getByText(/Error al obtener el valor del dólar/i)).toBeInTheDocument();
    });
  });
});
