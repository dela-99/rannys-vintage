import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true },
    source: { type: String, default: "website" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
