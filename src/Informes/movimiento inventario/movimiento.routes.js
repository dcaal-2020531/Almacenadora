import { Router } from 'express'
import { 
    obtenerInformeMovimientos, 
    generarInformeMovimientos
} from './movimiento.controller.js'

const api = Router()

// Ruta para obtener el informe de movimientos (en formato JSON)
api.get('/informe', obtenerInformeMovimientos)

// Ruta para generar el informe de movimientos (en formato Excel)
api.get('/excel', generarInformeMovimientos)

export default api
