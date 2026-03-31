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

// Welcome route with a modern, centered message
app.get("/", (req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BookNest | API Welcome</title>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #6366f1;
          --secondary: #a855f7;
          --bg: #0f172a;
          --text: #f8fafc;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Outfit', sans-serif;
          background: radial-gradient(circle at top left, #1e293b, #0f172a);
          color: var(--text);
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.8s ease-out;
        }
        h1 {
          font-size: 3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          background: linear-gradient(to right, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        p {
          font-size: 1.1rem;
          color: #94a3b8;
          max-width: 400px;
          line-height: 1.6;
        }
        .badge {
          display: inline-block;
          margin-bottom: 1.5rem;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="glass-card">
        <div class="badge">Backend Active</div>
        <h1>Welcome to BookNest</h1>
        <p>The core engine of your library management system is running smoothly. Ready to serve your requests.</p>
      </div>
    </body>
    </html>
  `);
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
