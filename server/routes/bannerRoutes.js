import express from "express";
import {
  createBanner,
  deleteBanner,
  getBanners,
  updateBanner,
} from "../controllers/bannerController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { requireFields } from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", getBanners);
router.get("/admin/all", protect, adminOnly, getBanners);
router.post("/", protect, adminOnly, requireFields(["title", "image"]), createBanner);
router.patch("/:id", protect, adminOnly, updateBanner);
router.delete("/:id", protect, adminOnly, deleteBanner);

export default router;
