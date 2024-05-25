import express from 'express'
import { adminregisterController, empregisterController, emploginController, admloginController } from '../controller/authController.js'

const router = express.Router()

router.post('/empregister',empregisterController)
router.post('/adminregister',adminregisterController)
router.post('/emplogin', emploginController)
router.post('/admlogin', admloginController)
export default router