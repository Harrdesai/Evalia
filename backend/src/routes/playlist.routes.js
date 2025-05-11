// src/routes/playlist.routes.js

import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getAllListDetails,
  getPlaylistDetails,
  createPlaylist,
  addProblemToPlaylist,
  updatePlaylist,
  deleteProblemFromPlaylist,
  deletePlaylist
} from '../controllers/playlist.controllers.js';

const playlistRoutes = Router();

playlistRoutes.get('/get-all-list-details', authMiddleware, getAllListDetails);

playlistRoutes.get('/get-playlist-details/:id', authMiddleware, getPlaylistDetails);

playlistRoutes.post('/create-playlist', authMiddleware, createPlaylist);

playlistRoutes.post('/add-problem/:playlistId', authMiddleware, addProblemToPlaylist);

playlistRoutes.put('/update-playlist/:id', authMiddleware, updatePlaylist);

playlistRoutes.delete('/delete-problem-from-playlist/:playlistId', authMiddleware, deleteProblemFromPlaylist);

playlistRoutes.delete('/delete-playlist/:playlistId', authMiddleware, deletePlaylist);

export default playlistRoutes;