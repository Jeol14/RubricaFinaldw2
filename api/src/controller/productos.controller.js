import { pool } from "../db.js";

// Controladores para la tabla de Productos

export const getProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        
        console.log('Rows:', rows);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No productos found.' });
        }
    
        res.send(rows);
    } catch (error) {
        console.error('Error fetching productos:', error);
        res.status(500).json({ message: 'Internal Server Error.', error });
    }
}

export const getProducto = async (req, res) => {
    const codigo = req.params.codigo;
    try {
        const [rows] = await pool.query('SELECT * FROM productos WHERE codigo = ?', [codigo]);
        if (rows.length <= 0) return res.status(400).json({ message: 'Producto no registrado' });
        res.send(rows[0]);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error', error });
    }
}

export const createProducto = async (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    try {
        const [rows] = await pool.query('INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, stock]);
        res.send({
            // codigo: rows.insertId,
            nombre,
            descripcion,
            precio,
            stock
        });
        console.log(rows);
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error', error_code:error });
    }
}

export const updateProducto = async (req, res) => {
    const { codigo } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    try {
        const [result] = await pool.query('UPDATE productos SET nombre=IFNULL(?,nombre), descripcion=IFNULL(?,descripcion), precio=IFNULL(?,precio), stock=IFNULL(?,stock) WHERE codigo=?', [nombre, descripcion, precio, stock, codigo]);
        if(result.affectedRows<=0)return res.status(404).json({
            message:'Producto no encontrado'
        })
        const [rows] = await pool.query('SELECT * FROM productos WHERE codigo=?', [codigo])
        res.json(rows[0])
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' })
    }
}

export const deleteProducto = async (req, res) => {
    const { codigo } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM productos WHERE codigo=?', [codigo]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: 'Producto no encontrado' });
        res.sendStatus(204); 
    } catch (error) {
        return res.status(500).json({ message: 'Ha ocurrido un error' });
    }
}
