import { Router } from 'express'
import { 
    obtenerInformeInventario, 
    generarInformeInventario 
} from './inventario.controller.js'

const api = Router()

// Ruta para obtener el informe de inventario en formato JSON
api.get('/informe', obtenerInformeInventario)

// Ruta para generar el informe de inventario en Excel
api.get('/informe/excel', generarInformeInventario)

export default api