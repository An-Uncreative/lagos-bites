import { Order } from "../models/order.js";
import {
  initializePaystack,
  verifyPaystack,
  nairaToKobo,
  isValidPaystackSignature,
} from "../services/paystack.services.js";

/**
 * POST /api/payments/paystack/initialize/:orderId
 * Creates reference (if missing), calls Paystack initialize, returns authorization_url
 */
export async function initPaystackForOrder(req, res) {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order)
    return res.status(404).json({ ok: false, message: "Order not found" });

  if (order.payment.status === "paid") {
    return res.json({ ok: true, message: "Order already paid", order });
  }

  // Ensure we have a reference on the order (generated once and reused)
  if (!order.payment.reference) {
    // You can generate a better reference format; this is simple and unique-ish:
    order.payment.reference = `order_${order._id}_${Date.now()}`;
    await order.save();
  }

  const amountKobo = nairaToKobo(order.total);

  // Your frontend should have an email. If your order model doesn't store it, add it or collect it.
  const customerEmail = req.body.email;
  if (!customerEmail) {
    return res.status(400).json({
      ok: false,
      message: "Customer email is required for Paystack initialization",
    });
  }

  const paystackData = await initializePaystack({
    email: customerEmail,
    amountKobo,
    reference: order.payment.reference,
    callback_url: `${process.env.APP_URL}/paystack/callback`, // optional
    metadata: { orderId: String(order._id) }, // helps you link tx to order :contentReference[oaicite:11]{index=11}
  });

  if (!paystackData) {
    return res.status(502).json({
      ok: false,
      message: "Failed to initialize Paystack transaction",
    });
  }

  return res.json({
    ok: true,
    reference: order.payment.reference,
    authorization_url: paystackData.authorization_url,
    access_code: paystackData.access_code,
  });
}

/**
 * GET /api/payments/paystack/verify/:reference
 * Verifies transaction and marks order paid (idempotent)
 */
export async function verifyPaystackAndMarkPaid(req, res) {
  const reference = req.body?.reference || req.params?.reference;
  const orderId = req.body?.orderId; // for POST flow

  if (!reference) {
    return res
      .status(400)
      .json({ success: false, message: "reference is required" });
  }

  let order = null;

  // ✅ Preferred: find by orderId (works for inline checkout)
  if (orderId) {
    order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
  } else {
    // ✅ Fallback: find by reference (works only if you stored reference beforehand)
    order = await Order.findOne({ "payment.reference": reference });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found for reference" });
    }
  }

  // Idempotency
  if (order.payment?.status === "paid") {
    return res.json({
      success: true,
      data: {
        verified: true,
        status: "paid",
        reference: order.payment.reference,
        orderId: order._id.toString(),
      },
      message: "Already paid",
    });
  }

  const tx = await verifyPaystack(reference);

  // Always record verification attempt
  order.payment = order.payment || {};
  order.payment.verifiedAt = new Date();

  if (!tx) {
    await order.save();
    return res
      .status(400)
      .json({ success: false, message: "Unable to verify transaction" });
  }

  const expectedAmount = nairaToKobo(order.total);

  const isSuccess = tx.status === "success";
  const isAmountMatch = Number(tx.amount) === expectedAmount;
  const isCurrencyMatch = (tx.currency || "NGN") === (order.currency || "NGN");

  // ✅ Attach reference if missing (inline flow)
  if (!order.payment.reference) {
    order.payment.reference = reference;
  }

  const isReferenceMatch = tx.reference === order.payment.reference;

  if (isSuccess && isAmountMatch && isCurrencyMatch && isReferenceMatch) {
    order.payment.status = "paid";
    order.payment.paidAt = new Date(tx.paid_at || Date.now());
    await order.save();

    return res.json({
      success: true,
      data: {
        verified: true,
        status: "paid",
        reference: order.payment.reference,
        orderId: order._id.toString(),
      },
      message: "Payment verified & order marked paid",
    });
  }

  order.payment.status = "failed";
  await order.save();

  return res.status(400).json({
    success: false,
    message: "Payment verification failed checks",
    data: {
      checks: { isSuccess, isAmountMatch, isCurrencyMatch, isReferenceMatch },
    },
    tx,
  });
}

/**
 * POST /api/webhooks/paystack
 * Paystack sends events here. Validate signature with RAW body. :contentReference[oaicite:13]{index=13}
 */
export async function paystackWebhook(req, res) {
  const signature = req.headers["x-paystack-signature"];
  const rawBody = req.rawBody;

  if (!signature || !rawBody) return res.status(400).send("Bad Request");

  const valid = isValidPaystackSignature(rawBody, signature);
  if (!valid) return res.status(401).send("Invalid signature");

  const event = req.body;

  // For successful charges, Paystack sends an event you should act on (commonly "charge.success")
  if (event?.event === "charge.success") {
    const reference = event?.data?.reference;
    if (reference) {
      // Use the same verification logic to be safe (webhook says success, but we still verify)
      // This also makes it idempotent and consistent.
      const order = await Order.findOne({ "payment.reference": reference });

      if (order && order.payment.status !== "paid") {
        const tx = await verifyPaystack(reference);
        if (tx) {
          const expectedAmount = nairaToKobo(order.total);

          const ok =
            tx.status === "success" &&
            Number(tx.amount) === expectedAmount &&
            tx.currency === order.currency &&
            tx.reference === reference;

          order.payment.verifiedAt = new Date();

          if (ok) {
            order.payment.status = "paid";
            order.payment.paidAt = new Date(tx.paid_at || Date.now());
          } else {
            order.payment.status = "failed";
          }

          await order.save();
        }
      }
    }
  }

  // Respond 200 quickly so Paystack doesn't retry
  return res.sendStatus(200);
}
