import compression from "compression";
import cors from "cors";
import express, { Request, Response } from "express";
import morgan from "morgan";
import { env, isDevelopment } from "./config/environment";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import {
  apiRateLimiter,
  requestSizeLimiter,
  requestTimeout,
  securityHeaders,
} from "./middleware/security";
import routes from "./routes";
import { logger } from "./utils/logger";

const app = express();

// Security headers
app.use(securityHeaders);

// Request timeout
app.use(requestTimeout(30000)); // 30 seconds

// Request size limiter
app.use(requestSizeLimiter);

// Rate limiting (disabled in development)
if (!isDevelopment) {
  app.use(apiRateLimiter);
}

// Compression
app.use(compression());

// CORS configuration
app.use(
  cors({
    origin: isDevelopment
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : [env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );
}

// Request logging
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.logRequest(req.method, req.url, res.statusCode, duration);
  });

  next();
});

// Health check root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Sabbir Ahmed Portfolio API v2 is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// API routes
app.use("/api", routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

