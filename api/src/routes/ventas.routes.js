import { Router } from "express";
import { createVenta, deleteVenta, getVenta, getVentas, updateVenta } from "../controller/ventas.controller.js";

const router = Router();

router.get('/ventas', getVentas);
router.get('/ventas/:codigo', getVenta);
router.post('/ventas', createVenta);
router.patch('/ventas/:codigo', updateVenta);
router.delete('/ventas/:codigo', deleteVenta);

export default router;
