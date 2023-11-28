import { Router } from "express";
import { prueba } from "../controller/index.controller.js";

const router=Router()

router.get('/prueba',prueba)
export default router