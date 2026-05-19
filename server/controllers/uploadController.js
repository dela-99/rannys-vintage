import { asyncHandler } from "../middleware/asyncHandler.js";
import { deleteImage, uploadImage } from "../utils/cloudinaryUpload.js";

export const uploadImages = asyncHandler(async (req, res) => {
  const folder = req.body.folder || "rannys-clothing/products";
  const files = req.files || [];

  if (files.length === 0) {
    res.status(400);
    throw new Error("At least one image is required");
  }

  const images = await Promise.all(files.map((file) => uploadImage(file, folder)));

  res.status(201).json({ success: true, images });
});

export const removeImage = asyncHandler(async (req, res) => {
  await deleteImage(req.body.publicId);
  res.json({ success: true, message: "Image deleted" });
});
