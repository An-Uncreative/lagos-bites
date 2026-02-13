import mongoose from "mongoose";
import { created } from "../utils/respond.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.js";
import { Meal } from "../models/Meal.js";

function computeTotals(items) {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const delivery = subtotal > 0 ? 1500 : 0;
  const total = subtotal + delivery;
  return { subtotal, delivery, total };
}

export const createOrder = asyncHandler(async (req, res) => {
  const { customer, items } = req.validated.body;

  if (!items?.length) {
    throw new ApiError(400, "Cart is empty");
  }

  // 1) Validate IDs first (avoid Mongoose CastErrors)
  for (const it of items) {
    if (!mongoose.Types.ObjectId.isValid(it.mealId)) {
      throw new ApiError(400, `Invalid mealId: ${it.mealId}`);
    }
  }

  // 2) Fetch meals in one query (efficient)
  const mealIds = items.map((it) => new mongoose.Types.ObjectId(it.mealId));
  const meals = await Meal.find({ _id: { $in: mealIds }, isAvailable: true });

  // 3) Rebuild items using DB truth (name + price), never trust client price
  const rebuiltItems = items.map((it) => {
    const meal = meals.find((m) => m._id.toString() === it.mealId);
    if (!meal) throw new ApiError(404, `Meal not found: ${it.mealId}`);

    return {
      mealId: meal._id.toString(),
      name: meal.name,
      price: meal.price,
      qty: it.qty,
    };
  });

  const { subtotal, delivery, total } = computeTotals(rebuiltItems);

  const order = await Order.create({
    customer,
    items: rebuiltItems,
    subtotal,
    delivery,
    total,
    currency: "NGN",
    payment: { status: "pending" },
  });

  return created(res, { orderId: order._id.toString(), total });
});
