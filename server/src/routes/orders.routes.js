import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { createOrder } from "../controllers/orders.controller.js";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  body: z.object({
    customer: z.object({
      name: z.string().min(2).max(120),
      phone: z.string().min(7).max(30),
      address: z.string().min(5).max(240),
      notes: z.string().max(500).optional().default(""),
    }),
    items: z
      .array(
        z.object({
          mealId: z.string().min(1),
          name: z.string().min(1),
          price: z.number().min(0),
          qty: z.number().int().min(1).max(99),
        }),
      )
      .min(1),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

ordersRouter.post("/", validate(createOrderSchema), createOrder);
