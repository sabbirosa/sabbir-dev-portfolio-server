import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";

import { env, isDevelopment } from "./config/environment";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

// ---------- CORS (simple + safe) ----------
const frontendUrl = process.env.FRONTEND_URL || env.FRONTEND_URL;

let allowedOrigins: (string | RegExp)[];
if (!isDevelopment) {
  allowedOrigins =
    frontendUrl && frontendUrl !== "http://localhost:3000"
      ? frontendUrl.split(",").map((u) => u.trim())
      : [
          "https://sabbir-dev-portfolio-client.vercel.app",
          /^https:\/\/sabbir-dev-portfolio-client.*\.vercel\.app$/, // previews
        ];
} else {
  allowedOrigins = ["http://localhost:3000", "http://127.0.0.1:3000"];
}

const corsConfig: cors.CorsOptions = {
  credentials: true,
  origin(origin, cb) {
    if (!origin) return cb(null, true); // Postman/mobile/etc.
    const ok = allowedOrigins.some((o) =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    cb(ok ? null : new Error(`CORS: origin not allowed: ${origin}`), ok);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  // Keep headers simple—browser will request what it needs and cors will reflect them.
};

// Reply to all preflights early
app.options("*", cors(corsConfig));
// Apply CORS
app.use(cors(corsConfig));

// ---------- Basics ----------
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(isDevelopment ? morgan("dev") : morgan("combined"));

// ---------- Health ----------
app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Sabbir Bin Abdul Latif Portfolio API v2 is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ---------- API ----------
app.use("/api", routes);

// ---------- Errors ----------
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
