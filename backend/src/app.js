import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import { ApiError } from "./utils/api-error.js";

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // If it's an ApiError, return a structured error response
    console.log(`${err.statusCode} : status code`);
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.errors || []
      
    });
  }

  // Default error handler for other errors
  console.error(err);
  return res.status(500).json({
    message: "Internal Server Error",
    details: []
  });
});


// router imports
import healthCheckRouter from './routes/healthcheck.routes.js';
import authRouter from './routes/auth.routes.js';
import problemRoutes from "./routes/problem.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/problems", problemRoutes)

export default app;