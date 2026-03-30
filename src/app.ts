import express, { Application, Request, Response } from "express";
// import { auth } from "./app/lib/auth";
// import { toNodeHandler } from "better-auth/node";
// import cookieParser from "cookie-parser";
import cors from "cors";
import { IndexRoutes } from "./routes";

const app: Application = express();
// app.use(cookieParser());
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// app.all("/api/auth/*splat", toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Express!");
});
app.use("/api/v1", IndexRoutes);

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
