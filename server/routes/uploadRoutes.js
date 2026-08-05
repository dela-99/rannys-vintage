import express from "express";
import { removeImage, uploadImages } from "../controllers/uploadController.js";
import { requireAppwriteAdmin } from "../middleware/appwriteAuthMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", requireAppwriteAdmin, upload.array("images", 8), uploadImages);
router.delete("/", requireAppwriteAdmin, removeImage);

export default router;
