import { Link } from "react-router-dom";
import heroImg from "../assets/hero.jpg";

/**
 * Landing page with a striking hero section and a short overview of
 * Lagos Bites' value proposition. Encourages the visitor to explore
 * the menu or proceed directly to checkout.
 */
export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="section hero">
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
    </main>
  );
}
