import { Order } from "../models/order.js";
import { ok } from "../utils/respond.js";

export async function getAllOrdersAdmin(req, res) {
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

  return ok(res, orders);
}

export async function getAdminMetrics(req, res) {
  // Basic metrics for a restaurant owner
  const [totalOrders, paidOrders] = await Promise.all([
    Order.countDocuments({}),
    Order.countDocuments({ "payment.status": "paid" }),
  ]);

  // Compute revenue from paid orders
  const revenueAgg = await Order.aggregate([
    { $match: { "payment.status": "paid" } },
    { $group: { _id: null, revenue: { $sum: "$total" } } },
  ]);

  const totalRevenue = revenueAgg?.[0]?.revenue || 0;

  return ok(res, {
    totalOrders,
    paidOrders,
    totalRevenue,
  });
}
