import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    images: [{ type: String }], // Cloudinary URLs
    stock: [
      {
        size: { type: String, required: true },
        quantity: { type: Number, default: 0, min: 0 },
      },
    ],
    isNewArrival: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true },
);

// Virtual for total stock across all sizes
ProductSchema.virtual("totalQuantity").get(function () {
  return this.stock.reduce((total, item) => total + item.quantity, 0);
});

export const Product = mongoose.model("Product", ProductSchema);
