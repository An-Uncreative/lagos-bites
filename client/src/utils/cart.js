const CART_KEY = "lagos_bites_cart_v2";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((x) => x.mealId === item.mealId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((sum, it) => sum + it.price * it.qty, 0);
  const delivery = subtotal > 0 ? 1500 : 0;
  const total = subtotal + delivery;

  return { subtotal, delivery, total };
}
