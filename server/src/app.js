import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { env } from "./config/env.js";
import { mealsRouter } from "./routes/meals.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

function parseOrigins(value) {
  // Supports:
  // - "*" (allow all, no credentials)
  // - "http://localhost:5173,https://your-site.netlify.app" (comma-separated)
  if (!value) return ["*"];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function createApp() {
  const app = express();
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // ---- Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "img-src": ["'self'", "data:", "blob:", "*"],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );

  // ---- CORS (safe + production-correct)
  const allowedOrigins = parseOrigins(env.clientOrigin);

  // If "*" is used, we MUST NOT use credentials.
  const allowAll = allowedOrigins.includes("*");

  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow non-browser clients (curl/postman) with no origin header
        if (!origin) return cb(null, true);

        if (allowAll) return cb(null, true);

        if (allowedOrigins.includes(origin)) return cb(null, true);

        return cb(new Error(`CORS blocked origin: ${origin}`));
      },
      credentials: !allowAll, // ✅ only true when we’re not using "*"
    }),
  );

  // ---- Body parsing (Paystack raw body for webhook signature verification)
  app.use(
    express.json({
      limit: "200kb",
      verify: (req, res, buf) => {
        if (req.originalUrl.includes("/webhooks/paystack")) {
          req.rawBody = buf;
        }
      },
    }),
  );

  // ---- Health
  app.get("/health", (req, res) =>
    res.json({
      success: true,
      data: {
        status: "ok",
        env: env.nodeEnv || "unknown",
      },
    }),
  );

  // ---- API routes
  app.use("/api/meals", mealsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);

  // ---- Static images
  app.use(
    "/images",
    express.static(path.join(__dirname, "../public/images"), {
      setHeaders: (res) => {
        // Images are safe to be public cross-origin
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );

  // ---- Errors
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
