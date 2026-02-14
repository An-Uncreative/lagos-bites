import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { env } from "./config/env.js";
import { mealsRouter } from "./routes/meals.routes.js";
import { ordersRouter } from "./routes/orders.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

export function createApp() {
  const app = express();
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Configure Helmet with relaxed CSP for images
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

  app.use(cors({ origin: env.clientOrigin, credentials: true }));

  // MODIFIED: Added verify callback to capture the raw body for Paystack
  app.use(
    express.json({
      limit: "200kb",
      verify: (req, res, buf) => {
        // We only attach rawBody for the webhook route to save memory
        if (req.originalUrl.includes("/webhooks/paystack")) {
          req.rawBody = buf;
        }
      },
    }),
  );

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api/meals", mealsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/payments", paymentRouter);

  // Serve static images with proper CORS headers
  app.use(
    "/images",
    express.static(path.join(__dirname, "../public/images"), {
      setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      },
    }),
  );

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
