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

playlistRoutes.get('/:id/get-playlist-details', authMiddleware, getPlaylistDetails);

playlistRoutes.post('/create-playlist', authMiddleware, createPlaylist);

playlistRoutes.post('/:playlistId/add-problem', authMiddleware, addProblemToPlaylist);

playlistRoutes.put('/:id/update-playlist-detail', authMiddleware, updatePlaylist);

playlistRoutes.delete('/:playlistId/delete-problem-from-playlist/', authMiddleware, deleteProblemFromPlaylist);

playlistRoutes.delete('/delete-playlist/:playlistId', authMiddleware, deletePlaylist);

export default playlistRoutes;