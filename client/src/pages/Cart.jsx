import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, saveCart, cartTotals, clearCart } from "../utils/cart";

/**
 * Shopping cart page. Renders current items in a table with controls
 * to adjust quantities or remove entries. Summarises subtotal,
 * delivery and total and provides navigation to checkout.
 */
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
    <main className="section">
      <div className="container">
        <div className="section-title">
          <h2>Your Cart</h2>
          <div className="nav-links">
            <Link to="/menu">Back to menu</Link>
            {items.length > 0 && <Link to="/checkout">Checkout</Link>}
          </div>
        </div>

        {items.length === 0 ? (
          <p>Your cart is empty. Add some delicious meals!</p>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Meal</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => {
                    const sub = it.price * it.qty;
                    return (
                      <tr key={it.mealId}>
                        <td>{it.name}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            value={it.qty}
                            onChange={(e) =>
                              updateQty(it.mealId, Number(e.target.value))
                            }
                            style={{ width: 72 }}
                          />
                        </td>
                        <td>₦{it.price.toLocaleString("en-NG")}</td>
                        <td>₦{sub.toLocaleString("en-NG")}</td>
                        <td>
                          <button
                            className="btn"
                            onClick={() => removeItem(it.mealId)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ marginTop: 32, maxWidth: 400 }}>
              <div className="row">
                <span className="small">Subtotal</span>
                <b>₦{totals.subtotal.toLocaleString("en-NG")}</b>
              </div>
              <div className="row" style={{ marginTop: 8 }}>
                <span className="small">Delivery</span>
                <b>₦{totals.delivery.toLocaleString("en-NG")}</b>
              </div>
              <hr style={{ borderColor: "var(--line)", margin: "12px 0" }} />
              <div className="row">
                <span>Total</span>
                <b>₦{totals.total.toLocaleString("en-NG")}</b>
              </div>
              <div
                className="row"
                style={{ marginTop: 16, gap: 14, flexWrap: "wrap" }}
              >
                <button
                  className="btn"
                  onClick={() => {
                    clearCart();
                    setItems([]);
                  }}
                >
                  Clear cart
                </button>
                <button
                  className="btn primary"
                  onClick={() => nav("/checkout")}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
