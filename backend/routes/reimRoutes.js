import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { createReimItemController, createReimbursementController, delReimItem, deleteReimbursementController, getReimItem, getReimbursementByIdController, updateReimController, updateReimItem } from '../controller/reimController.js'

const router = express.Router()

router.post('/add-reim',userAuth,createReimbursementController   )
router.get('/get-reim/:id',userAuth,getReimbursementByIdController   )
router .delete('/del-reim/:id', userAuth, deleteReimbursementController)
router.put('/update-reim/:id',userAuth,updateReimController   )

//REIM ITEM

router.post('/add-reim-item',userAuth,createReimItemController   )
router.get('/get-reim-item/:id', userAuth, getReimItem)
router.put('/update-reim-item/:id', userAuth, updateReimItem )
router.delete('/del-reim-item/:id', userAuth, delReimItem )


export default router