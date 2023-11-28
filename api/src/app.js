import express from 'express';
import cors from 'cors';
import productosRoutes from './routes/productos.routes.js'
import ventasRoutes from './routes/ventas.routes.js';
import indexRoutes from './routes/index.routes.js'
const app = express()

const port = 5001;
// 5001 - puerto para API de productos
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json())
app.use('/api', productosRoutes)
app.use('/api', ventasRoutes)
app.use(indexRoutes)
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint not found'
    })
})
app.get('/', (req, res) => {
    res.send("Hola desde express")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
export default app;