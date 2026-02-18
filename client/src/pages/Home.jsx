import { Link } from "react-router-dom";
import heroImg from "../assets/hero.jpg";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import { addToCart } from "../utils/cart";

/**
 * Landing page with a striking hero section and a short overview of
 * Lagos Bites' value proposition. Encourages the visitor to explore
 * the menu or proceed directly to checkout.
 */
export default function Home() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", visible: false });

  useEffect(() => {
    api
      .getMeals()
      .then((res) => {
        setMeals(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Failed to load meals");
        setLoading(false);
      });
  }, []);
    
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Define which meals are “popular”
  const popularNames = ["Smoky Jollof Rice", "Chicken Shawarma", "Zobo (500ml)"];
  const picks = meals.filter((m) => popularNames.includes(m.name)).slice(0, 3);

  const handleOrder = (meal) => {
    addToCart({ mealId: meal._id, name: meal.name, price: Number(meal.price) });
    setToast({
      message: `${meal.name} added to cart successfully`,
      visible: true,
    });
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="section hero home-hero">
        <div className="container grid cols-2" style={{ alignItems: "center" }}>
          <div>
            <div className="kicker">Discover Lagos flavours</div>
            <h1 className="h1">Fresh &amp; Authentic Nigerian Meals</h1>
            <p className="p">
              From smoky jollof rice to sizzling suya, enjoy a curated selection
              of dishes delivered fast to your doorstep.
            </p>
            <div className="hero-actions">
              <Link to="/menu" className="btn primary">
                View menu
              </Link>
              <Link to="/checkout" className="btn">
                Checkout
              </Link>
            </div>
          </div>
          <div className="media">
            <img
              src={heroImg}
              alt="Assorted Nigerian food on a platter"
              className="thumb"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Why Choose Us</h2>
            <p>
              We go the extra mile to deliver authentic flavours, swift service
              and seamless ordering.
            </p>
          </div>
          <div className="grid cols-3">
            <div className="card">
              <h3>Curated Menu</h3>
              <p>
                Our chefs select the freshest ingredients to recreate classic
                Nigerian dishes with a modern twist.
              </p>
            </div>
            <div className="card">
              <h3>Fast Delivery</h3>
              <p>
                Whether you're at home or the office, expect your meal within
                minutes thanks to our efficient dispatchers.
              </p>
            </div>
            <div className="card">
              <h3>Secure Checkout</h3>
              <p>
                Pay with confidence via Paystack. Orders are verified on the
                server for your peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>
       {/* Popular Picks Section */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Popular picks</h2>
            <p>Customer favorites you can order in a few clicks.</p>
          </div>
          {loading ? (
            <p>Loading popular picks...</p>
          ) : error ? (
            <p style={{ color: "#f87171" }}>{error}</p>
          ) : (
            <div className="grid cols-3 popular-grid" style={{ marginTop: 20 }}>
              {picks.map((meal) => {
                const imgSrc = meal.imageUrl
                  ? `${import.meta.env.VITE_API_BASE_URL}${meal.imageUrl}`
                  : `https://source.unsplash.com/400x250/?${encodeURIComponent(
                      meal.name || meal.category,
                    )}`;
                return (
                  <div key={meal._id} className="card">
                    <div className="media">
                      <img
                        src={imgSrc}
                        alt={meal.name}
                        className="thumb"
                        loading="lazy"
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginTop: 12,
                      }}
                    >
                      <h3 style={{ margin: 0 }}>{meal.name}</h3>
                      <div className="price">
                        ₦{meal.price.toLocaleString("en-NG")}
                      </div>
                    </div>
                    <p className="small">{meal.desc}</p>
                    <button
                      className="btn primary"
                      style={{ marginTop: 12 }}
                      onClick={() => handleOrder(meal)}
                    >
                      Order
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {toast.visible && <div className="toast">{toast.message}</div>}
    </main>
  );
}
