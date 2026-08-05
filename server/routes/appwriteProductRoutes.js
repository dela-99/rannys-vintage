import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { appwriteProducts } from "../utils/appwriteProducts.js";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await appwriteProducts.list({
      category: req.query.category,
      status: "published",
      visible: true,
      limit: req.query.limit || 100,
      offset: req.query.offset || 0,
    });

    res.json({ success: true, products: result.documents, total: result.total });
  }),
);

router.get(
  "/:productId",
  asyncHandler(async (req, res) => {
    const product = await appwriteProducts.get(req.params.productId);

    if (product.status !== "published" || product.visible !== true) {
      res.status(404);
      throw new Error("Product not found.");
    }

    res.json({ success: true, product });
  }),
);

export default router;
