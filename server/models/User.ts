import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "STORE_ADMIN", "CUSTOMER"],
      default: "CUSTOMER",
    },
    phone: { type: String },
    address: {
      street: String,
      city: { type: String, default: "Accra" },
      gps: String,
    },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: String,
  },
  { timestamps: true },
);

export const User = mongoose.model("User", UserSchema);
