import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import testRoutes from '../routes/testRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from '../routes/authRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import liqRoutes from '../routes/liqroutes.js';
import reimRoutes from '../routes/reimRoutes.js';
import processRoutes from '../routes/processRoutes.js';
import errorMiddleware from '../middlewares/errorMiddleware.js';
import "express-async-errors";

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(cors({
    origin: ["https://reim-liq-system.vercel.app"],
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE", "POST"],
    credentials: true
}));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json("hello");
});

// Routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/reim', reimRoutes);
app.use('/api/v1/liq', liqRoutes);
app.use('/api/v1/process', processRoutes);

// Validation middleware
app.use(errorMiddleware);

export default app;
