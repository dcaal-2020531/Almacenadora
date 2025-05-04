import { Router } from 'express';
import {
  createProduct,
  getProducts,
  patchProduct,
  deleteProduct
} from '../product/product.controller.js';
import { validateAdmin } from '../../middleware/validate.admin.js';
import { validateJwt } from '../../validators/jwt.validator.js';

const api = Router();

api.post('/createproduct', createProduct);
api.get('/product', getProducts);
api.patch('/editproduct/:id', [validateJwt], patchProduct);   // <- PATCH, no PUT
api.delete('/deleteproduct/:id', [validateJwt, validateAdmin], deleteProduct);

export default api;
