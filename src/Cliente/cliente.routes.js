import { Router } from 'express';
import { 
    getAllClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deactivateCliente
} from './cliente.controller.js';
// import { validateJwt } from '../../middlewares/validate.jwt.js';

const api = Router();

api.get('/allclientes', getAllClientes);     // Ver todos los clientes activos
api.get('/cliente/:id', getClienteById);     // Ver un cliente por ID
api.post('/createcliente', createCliente);         // Crear un nuevo cliente
api.put('/editcliente/:id', updateCliente);      // Editar cliente
api.delete('/cliente/:id', deactivateCliente); // Dar de baja un cliente

export default api;
