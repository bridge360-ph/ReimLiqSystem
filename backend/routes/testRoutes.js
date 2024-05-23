import express from 'express'
import { testPostController } from '../controller/testController.js'

const router = express.Router()

router.post('/test-post', testPostController)


export default router