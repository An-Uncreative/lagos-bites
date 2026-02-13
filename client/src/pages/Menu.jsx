import { useEffect, useState } from "react";
import { api } from "../api/api";
import { addToCart } from "../utils/cart";
import { Link } from "react-router-dom";

export default function Menu() {
  const [meals, setMeals] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api
      .getMeals()
      .then((res) => setMeals(res.data))
      .catch(console.error);
  }, []);

  const filtered = meals.filter((m) =>
    (m.name + " " + m.category).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div style={{ padding: 40 }}>
      <div
        style={{
          padding: "48px 0",
          textAlign: "center",
        }}
      >
        <h1 className="h1">Lagos Bites</h1>
        <p className="muted" style={{ marginTop: 12 }}>
          Fresh meals delivered fast.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0 }}>Menu</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
        </div>
      </div>

      <p style={{ color: "#555" }}>Browse meals from MongoDB Atlas.</p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search meals..."
        style={{ padding: 10, width: "min(520px, 100%)", marginBottom: 20 }}
      />

      {filtered.map((meal) => (
        <div
          key={meal._id}
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
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 6px" }}>{meal.name}</h3>
              <div style={{ color: "#666", fontSize: 14 }}>{meal.category}</div>
              <div style={{ marginTop: 8, fontWeight: 800 }}>
                ₦{meal.price.toLocaleString("en-NG")}
              </div>
            </div>

            <button
              onClick={() =>
                addToCart({
                  mealId: meal._id,
                  name: meal.name,
                  price: meal.price,
                })
              }
              style={{ height: 44 }}
            >
              Add to cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
