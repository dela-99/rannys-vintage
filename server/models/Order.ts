import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true, required: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", index: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        size: String,
      },
    ],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: { type: String, enum: ["COD", "MoMo", "Card"], default: "COD" },
    paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
    deliveryNotes: String,
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", OrderSchema);
