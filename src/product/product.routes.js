import { Router } from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  patchProduct,
  deleteProduct
} from '../product/product.controller.js'

const api = Router();

api.post('/', createProduct);
api.get('/', getProducts);
api.put('/:id', updateProduct);       
api.patch('/:id', patchProduct);      
api.delete('/:id', deleteProduct);

export default api;
