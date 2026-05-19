import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    optimizedUrl: String,
    publicId: String,
    alt: String,
    width: Number,
    height: Number,
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    subcategory: { type: String, trim: true, index: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator(value) {
          return value === undefined || value === null || value < this.price;
        },
        message: "Discount price must be lower than regular price",
      },
    },
    images: { type: [imageSchema], default: [] },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isVisible: { type: Boolean, default: true, index: true },
    tags: { type: [String], default: [], index: true },
  },
  { timestamps: true },
);

productSchema.index({
  name: "text",
  description: "text",
  category: "text",
  subcategory: "text",
  tags: "text",
});

productSchema.pre("validate", function makeSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name);
  }

  next();
});

export const Product = mongoose.model("Product", productSchema);
