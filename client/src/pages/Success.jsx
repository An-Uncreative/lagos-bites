import { Link, useSearchParams } from "react-router-dom";

export default function Success() {
  const [params] = useSearchParams();
  const ref = params.get("ref");
  const orderId = params.get("orderId");

  return (
    <div style={{ padding: 40 }}>
      <h1>Order Successful ✅</h1>
      <p>This order was verified server-side using Paystack.</p>

      <div
        style={{
          padding: 14,
          border: "1px solid #ddd",
          borderRadius: 10,
          maxWidth: 640,
        }}
      >
        <div>
          <b>Order ID:</b> {orderId || "—"}
        </div>
        <div>
          <b>Paystack Reference:</b> {ref || "—"}
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
        <Link to="/">Back to menu</Link>
        <Link to="/cart">Cart</Link>
      </div>
    </div>
  );
}
