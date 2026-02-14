import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCart } from "../utils/cart";

/**
 * Persistent navigation bar. Shows the site brand and key routes.
 * Also displays a badge with the current total quantity in the cart.
 */
export default function Navbar() {
  const location = useLocation();
  const [count, setCount] = useState(0);

  // Recompute cart count whenever the location changes or on storage events.
  useEffect(() => {
    function update() {
      const cart = getCart();
      const qty = cart.reduce((sum, it) => sum + Number(it.qty || 0), 0);
      setCount(qty);
    }
    update();
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("storage", update);
    };
  }, [location]);

  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link className="brand" to="/">
          Lagos<span>Bites</span>
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">
            Cart{count > 0 && <span className="badge">{count}</span>}
          </Link>
          <Link to="/checkout">Checkout</Link>
        </div>
      </div>
    </nav>
  );
}