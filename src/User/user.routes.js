import {Router} from 'express'
import { getAll, updateUserProfile, deleteUserProfile } from './user.controller.js'
import { validateAdmin } from '../../middleware/validate.admin.js'


const api = Router()

api.get('/',getAll)
api.put('/:userId', updateUserProfile);
api.delete('/:userId',deleteUserProfile);




export default api  