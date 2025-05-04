import { Router } from 'express';
import { 
    getAllProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deactivateProveedor
} from '../controllers/proveedor.controller.js';
// import { validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

api.get('/allproveedores', getAllProveedores); // Ver todos los proveedores activos
api.get('/proveedor/:id', getProveedorById);   // Ver un proveedor por ID
api.post('/proveedor', createProveedor);       // Crear un nuevo proveedor
api.put('/proveedor/:id', updateProveedor);    // Editar proveedor
api.delete('/proveedor/:id', deactivateProveedor); // Dar de baja un proveedor

export default api;