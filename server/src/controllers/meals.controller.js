import { Meal } from "../models/Meal.js";
import { ok } from "../utils/respond.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listMeals = asyncHandler(async (req, res) => {
  const meals = await Meal.find({ isAvailable: true }).sort({ createdAt: -1 });
  return ok(res, meals);
});
