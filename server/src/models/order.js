import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true, trim: true, maxlength: 120 },
      phone: { type: String, required: true, trim: true, maxlength: 30 },
      address: { type: String, required: true, trim: true, maxlength: 240 },
      notes: { type: String, default: "", trim: true, maxlength: 500 },
    },
    items: [
      {
        mealId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 }, // naira snapshot
        qty: { type: Number, required: true, min: 1, max: 99 },
      },
    ],
    subtotal: { type: Number, required: true, min: 0 },
    delivery: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "NGN" },

    payment: {
      provider: { type: String, default: "paystack" },
      reference: { type: String},
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
      paidAt: { type: Date },
      verifiedAt: { type: Date },
    },
  },
  { timestamps: true },
);

OrderSchema.index({ "payment.reference": 1 }, { unique: true, sparse: true });

export const Order = mongoose.model("Order", OrderSchema);
