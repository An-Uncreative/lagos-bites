import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import { getCart, clearCart } from "../utils/cart";

export default function Checkout() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const items = getCart();

  // Proper totals calculation based on current items
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

  // ---- Paystack success handler (NOT async callback directly) ----
  async function handlePaystackSuccess(reference, orderId) {
    const verifyRes = await api.verifyPayment({
      reference,
      orderId,
    });

    if (verifyRes.data?.verified) {
      clearCart();
      nav(
        `/success?ref=${encodeURIComponent(
          reference,
        )}&orderId=${encodeURIComponent(orderId)}`,
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
      // Normalize items (important for validation)
      const normalizedItems = items.map((it) => ({
        mealId: it.mealId,
        name: it.name,
        price: Number(it.price),
        qty: Number(it.qty),
      }));

      // 1) Create order
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

      // 2) Open Paystack popup
      const PaystackPop = window.PaystackPop;
      if (!PaystackPop) throw new Error("Paystack script not loaded");

      const handler = PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: customer.email || "customer@test.com",
        amount: amountKobo,
        currency: "NGN",
        ref: `LB_${Date.now()}`,

        // IMPORTANT: NOT async
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
    <div className="container">
      <div className="header">
        <h1 className="h1">Checkout</h1>
        <div className="nav">
          <Link to="/">Menu</Link>
          <Link to="/cart">Cart</Link>
        </div>
      </div>

      <div className="badge mt-12">
        <b>Demo payment mode:</b>
        <span>
          This uses Paystack <b>test keys</b>. No real money will be charged.
        </span>
      </div>

      {error && <div className="alert mt-12">{error}</div>}

      <div className="grid2 mt-16">
        <div className="card">
          <h3 className="h3">Delivery details</h3>

          <div className="stack-10 mt-12">
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
              style={{ minHeight: 120 }}
            />
          </div>

          <button className="mt-12" onClick={payAndPlaceOrder} disabled={busy}>
            {busy ? "Processing..." : "Pay & Place Order"}
          </button>
        </div>

        <div className="card">
          <h3 className="h3">Order summary</h3>

          <div className="mt-12 row-between">
            <span className="muted">Subtotal</span>
            <b>₦{totals.subtotal.toLocaleString("en-NG")}</b>
          </div>
          <div className="mt-12 row-between">
            <span className="muted">Delivery</span>
            <b>₦{totals.delivery.toLocaleString("en-NG")}</b>
          </div>

          <hr className="hr" />

          <div className="row-between">
            <span>Total</span>
            <b>₦{totals.total.toLocaleString("en-NG")}</b>
          </div>

          <div className="muted mt-12" style={{ fontSize: 13 }}>
            Order is marked as paid only after server-side verification.
          </div>
        </div>
      </div>
    </div>
  );
}
