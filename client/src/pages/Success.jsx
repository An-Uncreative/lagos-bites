import { Link, useSearchParams } from "react-router-dom";

/**
 * Success page displayed after a successful payment verification. Shows
 * order identifiers and provides quick links back to the menu or cart.
 */
export default function Success() {
  const [params] = useSearchParams();
  const ref = params.get("ref");
  const orderId = params.get("orderId");
  return (
    <main className="section">
      <div className="container" style={{ textAlign: "center" }}>
        <h2 className="h2">Order Successful ✅</h2>
        <p className="p">
          Your payment has been verified server-side using Paystack. Thank you
          for ordering from Lagos Bites!
        </p>
        <div
          className="card"
          style={{ maxWidth: 540, margin: "0 auto", marginTop: 24 }}
        >
          <div className="row" style={{ marginBottom: 8 }}>
            <strong>Order ID:</strong>
            <span>{orderId || "—"}</span>
          </div>
          <div className="row">
            <strong>Paystack Reference:</strong>
            <span>{ref || "—"}</span>
          </div>
        </div>
        <div
          className="hero-actions"
          style={{ justifyContent: "center", marginTop: 24 }}
        >
          <Link to="/menu" className="btn primary">
            Back to menu
          </Link>
          <Link to="/cart" className="btn">
            View cart
          </Link>
        </div>
      </div>
    </main>
  );
}
