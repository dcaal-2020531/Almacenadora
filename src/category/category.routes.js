import { Router } from 'express';
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} from './category.controller.js';

const api = Router();

api.post('/', createCategory);
api.get('/', getAllCategory);
api.get('/:id', getCategoryById);
api.put('/:id', updateCategory);
api.delete('/:id', deleteCategory);

export default api;
