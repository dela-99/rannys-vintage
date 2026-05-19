import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    placement: {
      type: String,
      enum: ["home-hero", "home-strip", "shop-hero", "collection"],
      default: "home-hero",
      index: true,
    },
    image: {
      url: { type: String, required: true },
      optimizedUrl: String,
      publicId: String,
      alt: String,
    },
    ctaLabel: String,
    ctaUrl: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    startsAt: Date,
    endsAt: Date,
  },
  { timestamps: true },
);

export const Banner = mongoose.model("Banner", bannerSchema);
