import { Router } from 'express'
import { login,register } from './auth.controller.js'
import { loginValidator, registerValidator } from '../../validators/validators.js'

const api = Router()

api.post('/register',register)
api.post('/login'  , login)


export default api