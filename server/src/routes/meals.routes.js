import { Router } from "express";
import { listMeals } from "../controllers/meals.controller.js";

export const mealsRouter = Router();
mealsRouter.get("/", listMeals);
