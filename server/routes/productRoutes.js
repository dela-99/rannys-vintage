import express from "express";
import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getProductBySlugOrId,
  getProducts,
  getTrendingProducts,
  updateInventory,
  updateProduct,
} from "../controllers/productController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { requireFields } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/admin/all", protect, adminOnly, getProducts);
router.get("/search", getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/trending", getTrendingProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/:idOrSlug", getProductBySlugOrId);

router.post(
  "/",
  protect,
  adminOnly,
  requireFields(["name", "description", "category", "price"]),
  createProduct,
);
router.patch("/:id", protect, adminOnly, updateProduct);
router.patch("/:id/inventory", protect, adminOnly, updateInventory);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
