import express from 'express'
import { updateAdminController, updateEmpController } from '../controller/userController.js'
import userAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

router.put('/emp-update/:id',userAuth, updateEmpController  )
router.put('/adm-update/:id',userAuth,updateAdminController   )

export default router