// Centralized API helper for the Lagos Bites frontend.
//
// This module exposes functions to fetch meals, create orders and verify
// payments. It uses the VITE_API_BASE_URL environment variable which must
// point at your backend server (e.g. http://localhost:5000). Requests
// include a JSON content type header and default to including cookies.

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;

    // Try to surface zod field errors cleanly
    const fieldErrors = data?.details?.fieldErrors;
    if (fieldErrors) {
      const readable = Object.entries(fieldErrors)
        .map(([k, v]) => `${k}: ${v.join(", ")}`)
        .join(" | ");
      throw new Error(`${msg} — ${readable}`);
    }

    throw new Error(msg);
  }

  return data;
}

export const api = {
  // Fetch the list of meals from the backend. Returns a promise with
  // { data: array } where each element has { _id, name, category, price, available }.
  getMeals: () => request("/api/meals"),

  // Create a new order. Expects an object with customer and items fields.
  createOrder: (payload) =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Verify a completed Paystack payment. Accepts { reference, orderId }.
  verifyPayment: (payload) =>
    request("/api/payments/paystack/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
