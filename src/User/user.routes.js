import {Router} from 'express'
import { getAll, updateUserProfile, deleteUserProfile } from './user.controller.js'
//import { validateAdmin } from '../../middleware/validate.admin.js'


const api = Router()

api.get('/allemployee',getAll)
api.put('/updateemplyee/:userId', updateUserProfile);
api.delete('/deleteempleyee/:userId',deleteUserProfile);




export default api  