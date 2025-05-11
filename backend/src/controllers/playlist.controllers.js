// src/controllers/playlist.controllers.js

import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const getAllListDetails = async (request, response) => {

  try {
    
    const userId = request.user.id
    const playlists = await prisma.playlist.findMany({
      where: {
        userId
      },
      include: {
        problems: {
          include: {
            problem: true
          }
        }
      }
    })

    response.status(200).json(
      new ApiResponse(200, playlists, "Playlists fetched successfully")
    )

  } catch (error) {
    
    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Error While fetching playlist", {
        error: error.message
      })
    )

  }
}

const getPlaylistDetails = async (request, response) => {
  try {
    
    const playlistId = request.params.id
    const userId = request.user.id

    const playlist = await prisma.playlist.findFirst({
      where: {
        id: playlistId,
        userId
      },
      include: {
        problems: {
          include: {
            problem: true
          }
        }
      }
    })

    if (!playlist) {
      throw new ApiError(404, "Playlist not found")
    }

    response.status(200).json(
      new ApiResponse(200, playlist, "Playlist details fetched successfully")
    )

  } catch (error) {
    
    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Error While fetching playlist details", {
        error: error.message
      })
    )

  }
}

const createPlaylist = async (request, response) => {

  try {

    const { name, description } = request.body
    const userId = request.user.id

    if (!name || !description) {
      throw new ApiError(400, "Name and description are required")
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId
      }
    })

    response.status(200).json(
      new ApiResponse(200, playlist, "Playlist created successfully")
    )

  } catch (error) {

    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Error While fetching playlist", {
        error: error.message
      })
    )

  }
}

const addProblemToPlaylist = async (request, response) => {

  try {
    
    const userId = request.user.id
    const playlistId = request.params.id
    const problemIds = request.body.problemIds

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      throw new ApiError(400, "Invalid problem ids or no problem ids provided")
    }

    const problemsInPlaylist = await prisma.problemsInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId
      }))
    })

    response.status(200).json(
      new ApiResponse(200, problemsInPlaylist, "Problem added to playlist successfully")
    )

  } catch (error) {
    
    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Error While adding problem to playlist", {
        error: error.message
      })
    )

  }
}

const updatePlaylist = async (request, response) => {

  try {
    
    const playlistId = request.params.id
    const { name, description } = request.body

    if (!name || !description) {
      throw new ApiError(400, "Name and description are required")
    }

    const playlist = await prisma.playlist.update({
      where: {
        id: playlistId
      },
      data: {
        name,
        description
      }
    })

    response.status(200).json(
      new ApiResponse(200, playlist, "Playlist updated successfully")
    )
    
  } catch (error) {
    
    response.status(error.statusCode || 500).json(
      new ApiError(error.statusCode || 500, "Error While updating playlist", {
        error: error.message
      })
    )

  }
}

const deleteProblemFromPlaylist = async (request, response) => { }

const deletePlaylist = async (request, response) => { }

export {
  getAllListDetails,
  getPlaylistDetails,
  createPlaylist,
  addProblemToPlaylist,
  updatePlaylist,
  deleteProblemFromPlaylist,
  deletePlaylist
}