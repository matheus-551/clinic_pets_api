import { Router } from 'express'
import PetsController from '../modules/pets/pets.controller.js'

const router = Router()

router.get('/pets', PetsController.getAll)
router.get('/pets/:id', PetsController.getById)
router.post('/pets', PetsController.create)
router.put('/pets/:id', PetsController.update)
router.delete('/pets/:id', PetsController.remove)

export default router;