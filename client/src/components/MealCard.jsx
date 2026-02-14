import { addToCart } from "../utils/cart";

/**
 * Card component for displaying an individual meal. Provides an image,
 * name, category and price alongside a button to add the meal to the cart.
 *
 * Meals supplied by the backend do not include image URLs, so this
 * component uses Unsplash's source API to fetch a representative photo
 * based on the meal name. If you prefer to supply your own images,
 * pass an `image` prop or adjust the src below accordingly.
 */
export default function MealCard({ meal }) {
  const { _id, name, category, price } = meal;

  // Build a dynamic image URL from Unsplash. The dimensions control
  // the aspect ratio and ensure consistent sizing. Note: unsplash
  // delivers random images for the same query; caching may vary.
  const imgSrc = `https://source.unsplash.com/400x250/?${encodeURIComponent(
    name || category,
  )}`;

  return (
    <div className="card">
      <div className="media">
        <img src={imgSrc} alt={name} className="thumb" loading="lazy" />
      </div>
      <h3>{name}</h3>
      <p className="small">{category}</p>
      <div className="row" style={{ marginTop: 8 }}>
          <div className="price">₦{price.toLocaleString("en-NG")}</div>
          <button
            className="btn primary"
            onClick={() =>
              addToCart({ mealId: _id, name, price: Number(price) })
            }
          >
            Add to cart
          </button>
      </div>
    </div>
  );
}