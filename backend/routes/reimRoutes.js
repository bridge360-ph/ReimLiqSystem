import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { createReimItemController, createReimbursementController, delReimItem, deleteReimbursementController, getAllItems, getAllReim, getCreatedReim, getFilteredReim, getFilteredReim2, getReimItem, getReimbursementByIdController, updateReimController, updateReimItem } from '../controller/reimController.js'

const router = express.Router()

router.post('/add-reim', userAuth, createReimbursementController)
router.get('/get-reim/:id', userAuth, getReimbursementByIdController)
router.delete('/del-reim/:id', userAuth, deleteReimbursementController)
router.put('/update-reim/:id', userAuth, updateReimController)

//REIM ITEM

router.post('/add-reim-item', userAuth, createReimItemController)
router.get('/get-reim-item/:id', userAuth, getReimItem)
router.put('/update-reim-item/:id', userAuth, updateReimItem)
router.delete('/del-reim-item/:id', userAuth, delReimItem)


//OTHER ROUTES

router.get('/get-reim-items', userAuth, getAllItems)

router.get('/get-all-reim', userAuth, getAllReim)

router.get('/get-created-reim', userAuth, getCreatedReim)

router.get('/filtered-reim', userAuth, getFilteredReim)
router.get('/filtered-reim2', userAuth, getFilteredReim2)
export default router