import { Router } from 'express'
import { 
    obtenerEstadisticasProductos, 
    generarEstadisticasProductos 
} from './estadisticas.controller.js'

const api = Router()

// Ruta para obtener las estadísticas de productos (en formato JSON)
api.get('/informe', obtenerEstadisticasProductos)

// Ruta para generar el informe de estadísticas de productos (en formato Excel)
api.get('/informe/excel', generarEstadisticasProductos)

export default api