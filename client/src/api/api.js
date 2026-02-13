const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
  getMeals: () => request("/api/meals"),

  createOrder: (payload) =>
    request("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyPayment: (payload) =>
    request("/api/payments/paystack/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
