import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { acceptLiq, acceptReimbursementController, payReim, rejectLiq, rejectReimbursementController, returnLiq } from '../controller/processController.js'

const router = express.Router()

router.post('/accept-reim', userAuth, acceptReimbursementController)
router.post('/reject-reim', userAuth, rejectReimbursementController)
router.post('/pay-reim', userAuth, payReim)


router.post('/accept-liq', userAuth, acceptLiq)
router.post('/reject-liq', userAuth, rejectLiq)
router.post('/return-liq', userAuth, returnLiq)
export default router