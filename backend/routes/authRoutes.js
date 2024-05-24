import express from 'express'
import { adminregisterController, empregisterController } from '../controller/authController.js'

const router = express.Router()

router.post('/empregister',empregisterController)
router.post('/adminregister',adminregisterController)
export default router