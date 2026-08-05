import express from "express";
import { requireAppwriteAdmin } from "../middleware/appwriteAuthMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { appwriteProducts } from "../utils/appwriteProducts.js";

const router = express.Router();

router.use(requireAppwriteAdmin);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const result = await appwriteProducts.list({
      category: req.query.category,
      status: req.query.status,
      limit: req.query.limit || 25,
      offset: req.query.offset || 0,
    });

    res.json({ success: true, products: result.documents, total: result.total });
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const documentId = req.body.documentId || req.body.data?.slug;
    const product = await appwriteProducts.create(documentId, req.body.data);

    res.status(201).json({ success: true, product });
  }),
);

router.patch(
  "/:documentId",
  asyncHandler(async (req, res) => {
    const product = await appwriteProducts.update(req.params.documentId, req.body.data);

    res.json({ success: true, product });
  }),
);

router.delete(
  "/:documentId",
  asyncHandler(async (req, res) => {
    await appwriteProducts.delete(req.params.documentId);

    res.json({ success: true });
  }),
);

export default router;
