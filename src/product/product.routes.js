import { Router } from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  patchProduct,
  deleteProduct
} from '../product/product.controller.js'
import { validateAdmin } from '../../middleware/validate.admin.js';
import { validateJwt } from '../../validators/jwt.validator.js';

const api = Router();

api.post('/', createProduct);
api.get('/', getProducts);
api.put('/:id', [validateJwt,validateAdmin],updateProduct);       
api.patch('/:id', [validateJwt,validateAdmin],patchProduct);      
api.delete('/:id',[validateJwt,validateAdmin], deleteProduct);

export default api;
