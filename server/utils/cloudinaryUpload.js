import fs from "node:fs/promises";
import { cloudinary } from "../config/cloudinary.js";

export async function uploadImage(file, folder = "rannys-clothing/products") {
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });

  await fs.unlink(file.path).catch(() => {});

  return {
    url: result.secure_url,
    optimizedUrl: cloudinary.url(result.public_id, {
      secure: true,
      quality: "auto",
      fetch_format: "auto",
    }),
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImage(publicId) {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId);
}
