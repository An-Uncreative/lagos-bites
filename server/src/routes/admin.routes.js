import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getAllOrdersAdmin,
  getAdminMetrics,
} from "../controllers/admin.controller.js";

export const adminRouter = express.Router();

// All admin routes require login + admin role
adminRouter.use(protect);
adminRouter.use(restrictTo("admin"));

// GET /api/admin/orders
adminRouter.get("/orders", getAllOrdersAdmin);

// GET /api/admin/metrics
adminRouter.get("/metrics", getAdminMetrics);
