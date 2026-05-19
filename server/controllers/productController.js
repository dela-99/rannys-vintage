import { Product } from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { buildProductQuery, buildSort, getPagination } from "../utils/apiFeatures.js";
import { deleteImage } from "../utils/cloudinaryUpload.js";

export const getProducts = asyncHandler(async (req, res) => {
  const query = buildProductQuery(req.query);
  const sort = buildSort(req.query.sort);
  const { page, limit, skip } = getPagination(req.query);

  if (!req.user) {
    query.isVisible = true;
  }

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

export const getProductBySlugOrId = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  if (!req.user) {
    query.isVisible = true;
  }

  const product = await Product.findOne(query);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await Promise.all(product.images.map((image) => deleteImage(image.publicId)));
  await product.deleteOne();

  res.json({ success: true, message: "Product deleted" });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 8, 24);
  const products = await Product.find({ isFeatured: true, isVisible: true })
    .sort("-createdAt")
    .limit(limit);

  res.json({ success: true, products });
});

export const getTrendingProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 8, 24);
  const products = await Product.find({ isTrending: true, isVisible: true })
    .sort("-createdAt")
    .limit(limit);

  res.json({ success: true, products });
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 8, 24);
  const products = await Product.find({ isVisible: true }).sort("-createdAt").limit(limit);

  res.json({ success: true, products });
});

export const updateInventory = asyncHandler(async (req, res) => {
  const { stock } = req.body;

  if (stock === undefined || Number(stock) < 0) {
    res.status(400);
    throw new Error("Valid stock value is required");
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { stock: Number(stock) },
    { new: true, runValidators: true },
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});
