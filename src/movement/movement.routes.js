import {Router} from 'express';
import { registerEntry, registerExit, getHistory } from './movement.controller.js';

const api = Router();

api.post('/entrada', registerEntry);
api.post('/salida', registerExit);
api.get('/historial/:productId', getHistory);

export default api;