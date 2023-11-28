import { useState, useEffect } from 'react';
import axios from 'axios';

const InicioAdministrador = () => {
  const [productos, setProductos] = useState([]);

  const [nuevoProducto, setNuevoProducto] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
  });

  const [productoEditando, setProductoEditando] = useState(null);

  const [AgregandoProducto, setAgregandoProducto] = useState(null);

  useEffect(() => {
    // Obtener la lista de productos al cargar el componente
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/productos');
      console.log('API Response:', response.data);
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleInputChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleAgregarProducto = async () => {
    try {
      setAgregandoProducto(true);
      const response = await axios.post('http://localhost:5001/api/productos', nuevoProducto);
      // Assuming response.data is an object with the new product data
      const nuevoProductoAgregado = response.data;
      setProductos((prevProductos) => [...prevProductos, nuevoProductoAgregado]);
      setNuevoProducto({
        codigo: '',
        nombre: '',
        descripcion: '',
        precio: 0,
        stock: 0,
      });

    } catch (error) {
      console.error('Error al agregar producto:', error);
    } finally {
      // Ensure that AgregandoProducto is set to false even if there is an error
      setAgregandoProducto(false);

      // If you want to refresh the product list after adding, call obtenerProductos() here
      obtenerProductos();
    }
  };

  const handleEliminarProducto = async (codigo) => {
    try {
      await axios.delete(`http://localhost:5001/api/productos/${codigo}`);
      const productosActualizados = productos.filter((producto) => producto.codigo !== codigo);
      setProductos(productosActualizados);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  const handleEditarProducto = (producto) => {
    setProductoEditando(producto);
    setNuevoProducto({
      codigo: producto.codigo,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
    });
  };

  const handleConfirmarEdicion = async () => {
    try {
      await axios.patch(`http://localhost:5001/api/productos/${productoEditando.codigo}`, nuevoProducto);
      const updatedProduct = { ...productoEditando, ...nuevoProducto };
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.codigo === updatedProduct.codigo ? updatedProduct : producto
        )
      );
      obtenerProductos();

    } catch (error) {
      console.error('Error al editar producto:', error);
    }
    setProductoEditando(null);
    setNuevoProducto({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
    });
  };

  const handleCancelarEdicion = () => {
    // Cancelar la edición limpiando el estado
    setProductoEditando(null);
    setNuevoProducto({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
    });
  };

  const handleCancelarAgregar = () => {
    setAgregandoProducto(null);
    setNuevoProducto({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
    });
  }



  return (
    <div className="container mt-4">
      <h2>Tabla de Productos</h2>
      <button className="btn btn-primary mb-3" onClick={setAgregandoProducto}>
        Agregar Nuevo
      </button>

      {productos === undefined ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Cantidad en Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.codigo}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{producto.descripcion}</td>
                <td>${parseFloat(producto.precio).toFixed(2)}</td>
                <td>{producto.stock}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm m-1"
                    onClick={() => handleEditarProducto(producto)}
                    disabled={!!productoEditando}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm m-1"
                    onClick={() => handleEliminarProducto(producto.codigo)}
                    disabled={!!productoEditando}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {productoEditando && (
        <div>
          <h2>Editar Producto</h2>
          <form>
            {/* Campos del formulario para editar productos */}
            <div className="form-group">
              <label>Código:</label>
              <input
                type="text"
                name="codigo"
                value={nuevoProducto.codigo}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <input
                type="text"
                name="descripcion"
                value={nuevoProducto.descripcion}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="precio"
                value={nuevoProducto.precio}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={nuevoProducto.stock}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            {/* Botones para confirmar o cancelar la edición */}
            <button
              type="button"
              className="btn btn-success"
              onClick={handleConfirmarEdicion}
            >
              Confirmar Edición
            </button>
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={handleCancelarEdicion}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}

      {AgregandoProducto && (
        <div>
          <h2>Agregar Producto</h2>
          <form>
            {/* Campos del formulario para editar productos */}
            <div className="form-group">
              <label>Código:</label>
              <input
                type="text"
                name="codigo"
                value={nuevoProducto.codigo}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Descripción:</label>
              <input
                type="text"
                name="descripcion"
                value={nuevoProducto.descripcion}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                name="precio"
                value={nuevoProducto.precio}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Stock:</label>
              <input
                type="number"
                name="stock"
                value={nuevoProducto.stock}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            {/* Botones para confirmar o cancelar la edición */}
            <button
              type="button"
              className="btn btn-success m-2"
              onClick={handleAgregarProducto}
            >
              Agregar
            </button>
            <button
              type="button"
              className="btn btn-secondary m-2"
              onClick={handleCancelarAgregar}
            >
              Cancelar
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default InicioAdministrador;
