import express from "express";
import { removeImage, uploadImages } from "../controllers/uploadController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.array("images", 8), uploadImages);
router.delete("/", protect, adminOnly, removeImage);

export default router;
