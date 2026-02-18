import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { getCart, clearCart } from "../utils/cart";

/**
 * Checkout page. Presents a form for capturing delivery details and
 * triggers Paystack payment integration. On success, clears the cart
 * and navigates to a success screen.
 */
export default function Checkout() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const items = getCart();

  // Compute totals based on current cart contents
  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.qty),
      0,
    );
    const delivery = subtotal > 0 ? 1500 : 0;
    const total = subtotal + delivery;
    return { subtotal, delivery, total };
  }, [items]);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
    email: "customer@test.com",
  });

  // Handle Paystack success by verifying the payment then redirecting
  async function handlePaystackSuccess(reference, orderId) {
    const verifyRes = await api.verifyPayment({ reference, orderId });
    if (verifyRes.data?.verified) {
      clearCart();
      nav(
        `/success?ref=${encodeURIComponent(reference)}&orderId=${encodeURIComponent(
          orderId,
        )}`,
      );
      return;
    }
    throw new Error("Payment verification failed.");
  }

  async function payAndPlaceOrder() {
    setError("");
    if (items.length === 0) {
      setError("Cart is empty. Please add items before checkout.");
      return;
    }
    if (!customer.name || !customer.phone || !customer.address) {
      setError("Please fill in name, phone, and delivery address.");
      return;
    }
    setBusy(true);
    try {
      // Normalize items for backend validation
      const normalizedItems = items.map((it) => ({
        mealId: it.mealId,
        name: it.name,
        price: Number(it.price),
        qty: Number(it.qty),
      }));
      // 1) Create order on the server
      const createRes = await api.createOrder({
        customer: {
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          notes: String(customer.notes || ""),
        },
        items: normalizedItems,
      });
      const { orderId, total } = createRes.data;
      const amountKobo = Math.round(total * 100);
      // 2) Launch Paystack popup
      const PaystackPop = window.PaystackPop;
      if (!PaystackPop) throw new Error("Paystack script not loaded");
      const handler = PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: customer.email || "customer@test.com",
        amount: amountKobo,
        currency: "NGN",
        ref: `LB_${Date.now()}`,
        callback: function (response) {
          handlePaystackSuccess(response.reference, orderId).catch((e) => {
            setError(e.message || "Verification failed.");
            setBusy(false);
          });
        },
        onClose: function () {
          setError("Payment cancelled.");
          setBusy(false);
        },
      });
      handler.openIframe();
    } catch (e) {
      setError(e.message || "Checkout failed.");
      setBusy(false);
    }
  }

  return (
    <main className="section">
      <div className="container">
        <div className="section-title">
          <h2>Checkout</h2>
          <div className="nav-links">
            <Link to="/menu">Menu</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>
        <div className="notice">
          <strong>Demo payment mode:</strong> This uses Paystack test keys. No
          real money will be charged.
        </div>
        {error && (
          <div
            className="notice"
            style={{
              marginTop: 16,
              background: "rgba(239,68,68,.12)",
              borderColor: "rgba(239,68,68,.32)",
            }}
          >
            {error}
          </div>
        )}
        <div className="grid cols-2 checkout-grid" style={{ marginTop: 32 }}>
          {/* Delivery details */}
          <div className="card">
            <h3 className="h3">Delivery details</h3>
            <div
              className="stack-10"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 12,
              }}
            >
              <input
                placeholder="Full name"
                value={customer.name}
                onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                }
              />
              <input
                placeholder="Phone number"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />
              <input
                placeholder="Delivery address"
                value={customer.address}
                onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                }
              />
              <textarea
                placeholder="Notes (optional)"
                value={customer.notes}
                onChange={(e) =>
                  setCustomer({ ...customer, notes: e.target.value })
                }
              />
            </div>
            <button
              className="btn primary"
              style={{ marginTop: 16 }}
              onClick={payAndPlaceOrder}
              disabled={busy}
            >
              {busy ? "Processing..." : "Pay & Place Order"}
            </button>
          </div>
          {/* Order summary */}
          <div className="card">
            <h3 className="h3">Order summary</h3>
            <div className="row" style={{ marginTop: 12 }}>
              <span className="muted">Subtotal</span>
              <b>₦{totals.subtotal.toLocaleString("en-NG")}</b>
            </div>
            <div className="row" style={{ marginTop: 12 }}>
              <span className="muted">Delivery</span>
              <b>₦{totals.delivery.toLocaleString("en-NG")}</b>
            </div>
            <hr
              className="hr"
              style={{ borderColor: "var(--line)", margin: "12px 0" }}
            />
            <div className="row">
              <span>Total</span>
              <b>₦{totals.total.toLocaleString("en-NG")}</b>
            </div>
            <div className="muted" style={{ fontSize: 13, marginTop: 12 }}>
              Order is marked as paid only after server-side verification.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
