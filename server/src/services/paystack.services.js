import axios from "axios";
import crypto from "crypto";
import { env } from "../config/env.js";

const api = axios.create({
  baseURL: "https://api.paystack.co",
  headers: { Authorization: `Bearer ${env.paystackSecretKey}` },
  timeout: 15000,
});

// Paystack expects amount in subunit (kobo for NGN)
export const nairaToKobo = (naira) => Math.round(Number(naira) * 100);

export async function initializePaystack({
  email,
  amountKobo,
  reference,
  callback_url,
  metadata,
}) {
  const payload = {
    email,
    amount: String(amountKobo), // Paystack docs show amount as subunit string/int :contentReference[oaicite:5]{index=5}
    reference,
    callback_url,
    metadata,
  };

  const { data } = await api.post("/transaction/initialize", payload);
  if (!data?.status || !data?.data?.authorization_url) return null;
  return data.data; // contains authorization_url, access_code, reference
}

export async function verifyPaystack(reference) {
  try {
    const { data } = await api.get(
      `/transaction/verify/${encodeURIComponent(reference)}`,
    );

    // Warning: response.status is API-call status, not transaction status. :contentReference[oaicite:6]{index=6}
    if (!data?.status || !data?.data) return null;

    return data.data; // transaction object
  } catch (error) {
    console.error(
      `Paystack Error [${reference}]:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

// Webhook signature validation: X-Paystack-Signature is HMAC SHA512 of raw payload :contentReference[oaicite:7]{index=7}
export function isValidPaystackSignature(rawBody, signature) {
  const hash = crypto
    .createHmac("sha512", env.paystackSecretKey)
    .update(rawBody)
    .digest("hex");

  return hash === signature;
}