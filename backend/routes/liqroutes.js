import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { addLiq } from '../controller/liqController.js'

const router = express.Router()


router.post('/add-liq', userAuth,addLiq)





export default router