import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, saveCart, cartTotals, clearCart } from "../utils/cart";

export default function Cart() {
  const [items, setItems] = useState(getCart());
  const nav = useNavigate();

  const totals = useMemo(() => cartTotals(), [items]);

  function updateQty(mealId, qty) {
    const next = items.map((it) =>
      it.mealId === mealId ? { ...it, qty: Math.max(1, qty) } : it,
    );
    setItems(next);
    saveCart(next);
  }

  function removeItem(mealId) {
    const next = items.filter((it) => it.mealId !== mealId);
    setItems(next);
    saveCart(next);
  }

  return (
    <div style={{ padding: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>Cart</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/">Menu</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
      </div>

      {items.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Go to menu</Link>
        </p>
      ) : (
        <>
          <div style={{ marginTop: 18 }}>
            {items.map((it) => (
              <div
                key={it.mealId}
                style={{
                  padding: 14,
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800 }}>{it.name}</div>
                    <div style={{ color: "#666" }}>
                      ₦{it.price.toLocaleString("en-NG")}
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) =>
                        updateQty(it.mealId, Number(e.target.value))
                      }
                      style={{ width: 80, padding: 8 }}
                    />
                    <button onClick={() => removeItem(it.mealId)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 18,
              padding: 14,
              border: "1px solid #ddd",
              borderRadius: 10,
            }}
          >
            <div>
              Subtotal: <b>₦{totals.subtotal.toLocaleString("en-NG")}</b>
            </div>
            <div>
              Delivery: <b>₦{totals.delivery.toLocaleString("en-NG")}</b>
            </div>
            <div>
              Total: <b>₦{totals.total.toLocaleString("en-NG")}</b>
            </div>

            <div
              style={{
                marginTop: 12,
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  clearCart();
                  setItems([]);
                }}
              >
                Clear cart
              </button>
              <button onClick={() => nav("/checkout")}>
                Proceed to checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
