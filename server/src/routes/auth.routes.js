import express from 'express';
import { loginAdmin } from '../controllers/auth.controller.js';

export const authRouter = express.Router();

authRouter.post('/login', loginAdmin);