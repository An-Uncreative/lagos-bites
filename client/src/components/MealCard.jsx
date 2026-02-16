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
export default function MealCard({ meal, onAdd }) {
  const { _id, name, category, price, imageUrl } = meal;

  /*
   * Determine the correct image source for the meal.
   *
   * When the backend provides a local imageUrl (e.g. "/images/smoky_jollof_rice.jpg"),
   * prefix it with the API base URL so that the client requests the image from the
   * backend server. If no imageUrl exists, fall back to Unsplash using a dynamic
   * search based on the meal name or category.
   */
  const imgSrc = imageUrl
    ? `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`
    : `https://source.unsplash.com/400x250/?${encodeURIComponent(name || category)}`;

  return (
    <div className="card">
      <div className="media">
        {/* Use the computed src and include a lazy loading hint */}
        <img src={imgSrc} alt={name} className="thumb" loading="lazy" />
      </div>
      <h3>{name}</h3>
      <p className="small">{category}</p>
      <div className="row" style={{ marginTop: 8 }}>
        <div className="price">₦{price.toLocaleString("en-NG")}</div>
        {/* <button
          className="btn primary"
          onClick={() => addToCart({ mealId: _id, name, price: Number(price) })}
        >
          Add to cart
        </button> */}
        <button
          className="btn primary"
          onClick={() => {
            // Add to cart
            addToCart({ mealId: _id, name, price: Number(price) });
            // Trigger a callback if provided
            if (typeof onAdd === "function") {
              onAdd(meal);
            }
          }}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
