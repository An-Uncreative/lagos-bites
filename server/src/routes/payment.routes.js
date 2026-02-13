import express from "express";
import {
  initPaystackForOrder,
  verifyPaystackAndMarkPaid,
  paystackWebhook,
} from "../controllers/payment.controller.js";

export const paymentRouter = express.Router();

// Frontend can optionally initialize payment (not required for inline, but fine)
paymentRouter.post("/paystack/initialize/:orderId", initPaystackForOrder);

// Existing (optional) GET verify
paymentRouter.get("/paystack/verify/:reference/:orderId", verifyPaystackAndMarkPaid);


// ✅ NEW: POST verify (what your React checkout calls)
paymentRouter.post("/paystack/verify", async (req, res, next) => {
  try {
    const { reference, orderId } = req.body;

    if (!reference || !orderId) {
      return res.status(400).json({
        success: false,
        message: "reference and orderId are required",
      });
    }

    // Reuse your existing verify controller by passing params
    req.params.reference = reference;
    req.params.orderId = orderId; // if your controller needs it
    return verifyPaystackAndMarkPaid(req, res, next);
  } catch (err) {
    next(err);
  }
});

// webhook route
paymentRouter.post("/webhooks/paystack", paystackWebhook);
