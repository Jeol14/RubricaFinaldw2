import { useState, useEffect } from 'react';
import axios from 'axios';

const InicioAsesor = () => {

  const [ventas, setVentas] = useState([]);

  const [nuevaVenta, setNuevaVenta] = useState({
    codigo: '',
    codigoProducto: '',
    nombreCliente: '',
    telefono: '',
    FechaVenta: '',
    cantidadVendida: 0,
    TotalVenta: 0
  });

  const [ventaEditando, setVentaEditando] = useState(null);

  useEffect(() => {
    // Obtener la lista de productos al cargar el componente
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/ventas');
      console.log('API Response:', response.data);
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleInputChange = (e) => {
    console.log('Input Name:', e.target.name);
    console.log('Input Value:', e.target.value);
    setNuevaVenta({ ...nuevaVenta, [e.target.name]: e.target.value });
  };

  const handleAgregarVenta = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/ventas', nuevaVenta);
      console.log('API Response:', response.data);
      const nuevaVentaAgregada = response.data;
      setVentas((prevVentas) => [...prevVentas, nuevaVentaAgregada]);
    } catch (error) {
      console.error('Error al agregar venta:', error);
    }
    setNuevaVenta({
      codigo: '',
      codigoProducto: '',
      nombreCliente: '',
      telefono: '',
      FechaVenta: '',
      cantidadVendida: 0,
      TotalVenta: 0
    });
  };

  const handleEditarVenta = (venta) => {
    setVentaEditando(venta);
    // You can set the current data of the selected venta in the state for editing
    setNuevaVenta({
      codigo: venta.codigo,
      codigoProducto: venta.codigoProducto,
      nombreCliente: venta.nombreCliente,
      telefono: venta.telefono,
      FechaVenta: venta.FechaVenta,
      cantidadVendida: venta.cantidadVendida,
      TotalVenta: venta.TotalVenta
    });
  };
  
  const handleGuardarEdicion = () => {
    // Lógica para guardar la edición
    const nuevasVentas = ventas.map((venta) =>
      venta === ventaEditando ? { ...venta, ...nuevaVenta } : venta
    );
    setVentas(nuevasVentas);
    setVentaEditando(null);
    setNuevaVenta({
      codigo: '',
      codigoProducto: '',
      nombreCliente: '',
      telefono: '',
      FechaVenta: '',
      cantidadVendida: 0,
      TotalVenta: 0
    });
  };

  const handleEliminarVenta = async (venta) => {
    try {
      // Realizar la solicitud DELETE a la API para eliminar la venta por su codigo
      await axios.delete(`http://localhost:5001/api/ventas/${venta.codigo}`);
  
      // Actualizar el estado de React después de eliminar la venta
      const ventasSinEliminar = ventas.filter((v) => v !== venta);
      setVentas(ventasSinEliminar);
    } catch (error) {
      console.error('Error al eliminar venta:', error);
    }
  };
  

  const handleCerrarEdicion = () => {
    setVentaEditando(null);
    setNuevaVenta({
      codigo: '',
      codigoProducto: '',
      nombreCliente: '',
      telefono: '',
      FechaVenta: '',
      cantidadVendida: 0,
      TotalVenta: 0
    });
  };

  const handleCerrarAgregar = () => {
    setNuevaVenta({
      codigo: '',
      codigoProducto: '',
      nombreCliente: '',
      telefono: '',
      FechaVenta: '',
      cantidadVendida: 0,
      TotalVenta: 0
    });
  };

  return (
    <div className="container mt-4">
      <h2>Tabla de Ventas</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Código</th>
            <th>Código de Producto</th>
            <th>Nombre del Cliente</th>
            <th>Teléfono del Cliente</th>
            <th>Fecha de Venta</th>
            <th>Cantidad Vendida</th>
            <th>Total Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.codigo}>
              <td>{venta.codigo}</td>
              <td>{venta.codigoProducto}</td>
              <td>{venta.nombreCliente}</td>
              <td>{venta.telefono}</td>
              <td>{venta.FechaVenta}</td>
              <td>{venta.cantidadVendida}</td>
              <td>{venta.TotalVenta}</td>
              <td>
                <button
                  className="btn btn-info btn-sm m-1"
                  onClick={() => handleEditarVenta(venta)}
                  disabled={!!ventaEditando}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm m-1"
                  onClick={() => handleEliminarVenta(venta)}
                  disabled={!!ventaEditando}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {ventaEditando && (
        <>
          <h2>Editar Venta</h2>
          <form>
            <div className="form-group">
              <label>Código de Producto:</label>
              <input
                type="text"
                name="codigoProducto"
                value={nuevaVenta.codigoProducto}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Nombre del Cliente:</label>
              <input
                type="text"
                name="nombreCliente"
                value={nuevaVenta.nombreCliente}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Teléfono del Cliente:</label>
              <input
                type="text"
                name="telefono"
                value={nuevaVenta.telefono}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Fecha de Venta:</label>
              <input
                type="text"
                name="FechaVenta"
                value={nuevaVenta.FechaVenta}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Cantidad Vendida:</label>
              <input
                type="number"
                name="cantidadVendida"
                value={nuevaVenta.cantidadVendida}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Total Venta:</label>
              <input
                type="number"
                name="TotalVenta"
                value={nuevaVenta.TotalVenta}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={handleGuardarEdicion}
            >
              Guardar Edición
            </button>
            <button
              type="button"
              className="btn btn-secondary m-2"
              onClick={handleCerrarEdicion}
            >
              Cerrar Edición
            </button>
          </form>
        </>
      )}

      <h2>Añadir Nueva Venta</h2>
      <form>
        <div className="form-group">
          <label>Código de Producto:</label>
          <input
            type="text"
            name="codigoProducto"
            value={nuevaVenta.codigoProducto}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Nombre del Cliente:</label>
          <input
            type="text"
            name="nombreCliente"
            value={nuevaVenta.nombreCliente}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Teléfono del Cliente:</label>
          <input
            type="text"
            name="telefono"
            value={nuevaVenta.telefono}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Fecha de Venta:</label>
          <input
            type="text"
            name="FechaVenta"
            value={nuevaVenta.FechaVenta}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Cantidad Vendida:</label>
          <input
            type="number"
            name="cantidadVendida"
            value={nuevaVenta.cantidadVendida}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>        
        <div className="form-group">
          <label>Total Venta:</label>
          <input
            type="number"
            name="TotalVenta"
            value={nuevaVenta.TotalVenta}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <button
          type="button"
          className="btn btn-primary m-2"
          onClick={handleAgregarVenta}
        >
          Añadir Venta
        </button>
        <button
          type="button"
          className="btn btn-secondary m-2"
          onClick={handleCerrarAgregar}
        >
          Limpiar Añadir
        </button>
      </form>
    </div>
  );
};

export default InicioAsesor;