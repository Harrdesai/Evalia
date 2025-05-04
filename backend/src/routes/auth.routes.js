import express from 'express';
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/auth.controllers.js';
const authRoutes = express.Router();
import { authMiddleware } from '../middleware/auth.middleware.js';

authRoutes.post('/register', registerUser);

authRoutes.post('/login', loginUser);

authRoutes.post('/logout', authMiddleware, logoutUser);

authRoutes.get('/me', authMiddleware, getMe);

export default authRoutes;