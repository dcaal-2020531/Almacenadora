'use strict'

import express from 'express' //Servidor HTTP
import morgan from 'morgan' //Logs
import helmet from 'helmet' //Seguridad para HTTP
import cors from 'cors' //Acceso al API

import productRoutes from '../src/product/product.routes.js';
import categoryRoutes from '../src/category/category.routes.js';

import inventarioRoutes from '../src/Informes/Inventario/inventario.routes.js'; // Nueva ruta de inventario
import estadisticasRoutes from '../src//Informes/Estadísticas/estadisticas.routes.js'; // Nueva ruta de estadísticas
import movimientoInventario from '../src/Informes/movimiento inventario/movimiento.routes.js'; //Movimiento de inventario


const configs = (app)=>{
    app.use(express.json()) //Aceptar y enviar datos en JSON
    app.use(express.urlencoded({extended: false})) //No encriptar la URL
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
}

const routes = (app)=>{
    app.use('/v1/product', productRoutes);
    app.use('/v1/category', categoryRoutes);
    
    app.use('/v1/inventario', inventarioRoutes); // Ruta para informes de inventario
    app.use('/v1/estadisticas', estadisticasRoutes); // Ruta para estadísticas
    app.use('/v1/movimientoInventario', movimientoInventario); // Movimiento de inventario
}

export const initServer = async()=>{
    const app = express() //Instancia de express
    try{
        configs(app) //Aplicar configuraciones al servidor
        routes(app)
        app.listen(process.env.PORT)
        console.log(`Server running in port ${process.env.PORT}`)
    }catch(err){
        console.error('Server init failed', err)
    }
}