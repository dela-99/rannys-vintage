import { Banner } from "../models/Banner.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { deleteImage } from "../utils/cloudinaryUpload.js";

export const getBanners = asyncHandler(async (req, res) => {
  const query = req.user ? {} : { isActive: true };

  if (req.query.placement) {
    query.placement = req.query.placement;
  }

  const banners = await Banner.find(query).sort("sortOrder -createdAt");
  res.json({ success: true, banners });
});

export const createBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json({ success: true, banner });
});

export const updateBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  res.json({ success: true, banner });
});

export const deleteBanner = asyncHandler(async (req, res) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    res.status(404);
    throw new Error("Banner not found");
  }

  await deleteImage(banner.image?.publicId);
  await banner.deleteOne();

  res.json({ success: true, message: "Banner deleted" });
});
