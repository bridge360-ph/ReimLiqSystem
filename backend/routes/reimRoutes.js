import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { createReimItemController, createReimbursementController, deleteReimbursementController, getReimbursementByIdController, updateReimController } from '../controller/reimController.js'

const router = express.Router()

router.post('/add-reim',userAuth,createReimbursementController   )
router.get('/get-reim/:id',userAuth,getReimbursementByIdController   )
router.post('/add-reim-item',userAuth,createReimItemController   )
router .delete('/del-reim/:id', userAuth, deleteReimbursementController)
router.put('/update-reim/:id',userAuth,updateReimController   )
export default router