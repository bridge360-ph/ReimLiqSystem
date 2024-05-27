import express from 'express'
import { getUserByIdController, updateAdminController, updateEmpController } from '../controller/userController.js'
import userAuth from '../middlewares/authMiddleware.js'

const router = express.Router()

router.put('/emp-update/:id',userAuth, updateEmpController  )
router.put('/adm-update/:id',userAuth,updateAdminController   )
router.get('/get-user/:id',userAuth,getUserByIdController )

export default router