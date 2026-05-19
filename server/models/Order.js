import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    slug: String,
    image: String,
    quantity: { type: Number, required: true, min: 1 },
    size: String,
    color: String,
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      deliveryNotes: { type: String, trim: true },
    },
    products: {
      type: [orderItemSchema],
      validate: {
        validator(value) {
          return value.length > 0;
        },
        message: "Order must contain at least one product",
      },
    },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["Mobile Money", "Vodafone Cash", "Pay on Delivery", "WhatsApp"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
      index: true,
    },
    whatsAppMessage: String,
    whatsAppUrl: String,
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", orderSchema);
