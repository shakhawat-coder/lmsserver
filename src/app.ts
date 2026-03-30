import express, { Application, Request, Response } from "express";
import { auth } from "./lib/auth";
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import { IndexRoutes } from "./routes";

const app: Application = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:3000",
      process.env.BETTER_AUTH_URL || "http://localhost:5000",
      "https://booknest-tau-virid.vercel.app",
      "https://booknestserver-xi.vercel.app",
    ],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "better-auth-token",
      "X-Better-Auth-Session-Token",
      "x-better-auth-session-token",
    ],
    exposedHeaders: [
      "Authorization",
      "better-auth-token",
      "X-Better-Auth-Session-Token",
      "x-better-auth-session-token",
    ],
  }),
);

// Middleware to parse JSON bodies (BEFORE routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/api/auth/*splat", toNodeHandler(auth));

// Important: Place multer routes BEFORE body parsers for multipart/form-data
app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err,
  });
});

export default app;
