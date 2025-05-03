import { request, response } from "express";
import { ApiResponse } from "../utils/api-response.js";

const healthCheck = async (request, response) => {
  console.log("Health Check");
  return response.status(200).json(new ApiResponse(200, "Server is running"));
}

export { healthCheck }