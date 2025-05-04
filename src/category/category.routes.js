import { Router } from 'express';
import {
  createCategory,
  getAllCategory,
  getCategoryById,
  updateCategory,
  deleteCategory
} from './category.controller.js';

const api = Router();

api.post('/createcategory', createCategory);
api.get('/allcategory', getAllCategory);
api.get('/category/:id', getCategoryById);
api.put('/editcategory/:id', updateCategory);
api.delete('/deletecategory/:id', deleteCategory);

export default api;
