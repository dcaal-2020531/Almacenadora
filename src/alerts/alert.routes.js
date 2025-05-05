import express from 'express';
import { getAlerts } from './alert.controller.js';

const router = express.Router();

router.get('/', getAlerts);

export default router;
