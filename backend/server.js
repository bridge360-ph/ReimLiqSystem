//imports
import express from 'express';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js'
import cors from 'cors'
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import liqRoutes from './routes/liqroutes.js'
import reimRoutes from './routes/reimRoutes.js'
import processRoutes from './routes/processRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js';
import "express-async-errors"

const app = express()
dotenv.config()
connectDB()
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

//routes

app.use('/api/v1/test', testRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/reim', reimRoutes)
app.use('/api/v1/liq', liqRoutes)
app.use('/api/v1/process', processRoutes)
//validation middleware
app.use(errorMiddleware)

const PORT = process.env.PORT || 8080
//listen
app.listen(8080, () => {
    console.log(`Server Is Running sir on ${PORT}`)
})