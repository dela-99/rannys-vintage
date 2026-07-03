export function buildCloudinaryUrl(publicId: string, width = 1200) {
  if (!publicId) return "";
  const cleanId = publicId.replace(/^https?:\/\//, "").replace(/^res\.cloudinary\.com\//, "");
  return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "demo"}/image/upload/w_${width},q_auto,f_auto/${cleanId}`;
}

export function normalizeImageList(images: Array<string | undefined>) {
  return images.filter(Boolean).map((image) => image!.trim());
}
