import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { addLiq, createLiqItem, delLiqItem, deleteLiq, getAllLiq, getAllLiqItems, getCreatedLiq, getFilteredLiq, getFilteredLiq2, getLiqItem, getLiqbyID, updateLiq, updateLiqItem } from '../controller/liqController.js'

const router = express.Router()


router.post('/add-liq', userAuth, addLiq)
router.put('/update-liq/:id', userAuth, updateLiq)
router.get('/get-liq/:id', userAuth, getLiqbyID)
router.delete('/del-liq/:id', userAuth, deleteLiq)



router.post('/add-liq-item', userAuth, createLiqItem)
router.put('/update-liq-item/:id', userAuth, updateLiqItem)
router.get('/get-liq-item/:id', userAuth, getLiqItem)
router.delete('/del-liq-item/:id', userAuth, delLiqItem)


router.get("/get-all-items/:liquidationId", userAuth, getAllLiqItems)
router.get("/get-all-liq", userAuth, getAllLiq)
router.get("/get-created-liq", userAuth, getCreatedLiq)
router.get("/get-filtered-liq", userAuth, getFilteredLiq)
router.get("/get-filtered-liq2", userAuth, getFilteredLiq2)
export default router