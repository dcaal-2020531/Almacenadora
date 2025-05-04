'use strict'

import express from 'express' //Servidor HTTP
import morgan from 'morgan' //Logs
import helmet from 'helmet' //Seguridad para HTTP
import cors from 'cors' //Acceso al API
import clienteRoutes from '../src/client/cliente.routes.js'
import proveedorRoutes from '../src/supplier/proveedor.routes.js'
import categoryRoutes from '../src/category/category.routes.js'
import productRoutes from '../src/product/product.routes.js'
import loginAndRegisterRoutes from '../src/auth/auth.routes.js'
import employeeRoutes from '../src/User/user.routes.js'

const configs = (app)=>{
    app.use(express.json()) //Aceptar y enviar datos en JSON
    app.use(express.urlencoded({extended: false})) //No encriptar la URL
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
}

const routes = (app)=>{
    app.use('/v1/cliente', clienteRoutes )
    app.use('/v1/proveedor', proveedorRoutes)
    app.use('/v1/category', categoryRoutes)
    app.use('/v1/product', productRoutes)
    app.use('/v1/loginAndRegister', loginAndRegisterRoutes)
    app.use('/v1/employee', employeeRoutes)
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