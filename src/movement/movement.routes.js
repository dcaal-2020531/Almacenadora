import express from 'express';
import { registerEntry, registerExit, getHistory } from './movement.controller';

const router = express.Router();

router.post('/entrada', registerEntry);
router.post('/salida', registerExit);
router.get('/historial/:productId', getHistory);

export default router;