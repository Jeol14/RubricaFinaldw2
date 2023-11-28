import { Router } from "express";
import { createProducto, deleteProducto, getProducto, getProductos, updateProducto } from "../controller/productos.controller.js";

const router=Router()

router.get('/productos',getProductos)
router.get('/productos/:codigo',getProducto)
router.post('/productos',createProducto)
router.patch('/productos/:codigo',updateProducto)
router.delete('/productos/:codigo',deleteProducto)

export default router