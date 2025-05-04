import express from 'express';
import { registerUser, loginUser, logoutUser, getMe } from '../controllers/auth.controllers.js';
const authRoutes = express.Router();

authRoutes.post('/register', registerUser);

authRoutes.post('/login', loginUser);

authRoutes.post('/logout', logoutUser);

authRoutes.get('/me', getMe);

export default authRoutes;