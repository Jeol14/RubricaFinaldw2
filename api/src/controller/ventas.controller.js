import { pool } from "../db.js";

// Controladores para la tabla de Ventas

export const getVentas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ventas');
        res.send(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}

export const getVenta = async (req, res) => {
    const codigo = req.params.codigo;
    try {
        const [rows] = await pool.query('SELECT * FROM ventas WHERE codigo = ?', [codigo]);
        if (rows.length <= 0) return res.status(400).json({ message: 'Venta no registrada' });
        res.send(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}

// Inside createVenta controller
export const createVenta = async (req, res) => {
    const { codigoProducto, nombreCliente, telefono, FechaVenta, cantidadVendida, TotalVenta } = req.body;

    try {
        // Fetch product details to get current stock
        const [productRows] = await pool.query('SELECT * FROM productos WHERE codigo = ?', [codigoProducto]);
        
        if (productRows.length <= 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        const product = productRows[0];
        const currentStock = product.stock;

        if (currentStock < cantidadVendida) {
            return res.status(400).json({ message: 'Stock insuficiente para la venta.' });
        }

        // Proceed with the sale
        const [saleRows] = await pool.query('INSERT INTO ventas (codigoProducto, nombreCliente, telefono, FechaVenta, cantidadVendida, TotalVenta) VALUES (?, ?, ?, ?, ?, ?)', [codigoProducto, nombreCliente, telefono, FechaVenta, cantidadVendida, TotalVenta]);

        // Update product stock in productos table
        const updatedStock = currentStock - cantidadVendida;
        await pool.query('UPDATE productos SET stock = ? WHERE codigo = ?', [updatedStock, codigoProducto]);

        res.send({
            codigoProducto,
            nombreCliente,
            telefono,
            FechaVenta,
            cantidadVendida,
            TotalVenta
        });
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error', error_code: error });
    }
}

export const updateVenta = async (req, res) => {
    const { codigo } = req.params;
    const { codigoProducto, nombreCliente, telefono, FechaVenta, cantidadVendida, TotalVenta } = req.body;
    try {
        const [result] = await pool.query('UPDATE ventas SET codigoProducto=?, nombreCliente=?, telefono=?, FechaVenta=?, cantidadVendida=?, TotalVenta=? WHERE codigo=?', [codigoProducto, nombreCliente, telefono, FechaVenta, cantidadVendida, TotalVenta, codigo]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Venta no encontrada' });
        const [rows] = await pool.query('SELECT * FROM ventas WHERE codigo=?', [codigo]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}

export const deleteVenta = async (req, res) => {
    const { codigo } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM ventas WHERE codigo=?', [codigo]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Venta no encontrada' });
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}
