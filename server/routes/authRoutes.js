import express from "express";
import { createAdmin, getAdminProfile, loginAdmin } from "../controllers/authController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { requireFields } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/me", protect, adminOnly, getAdminProfile);
router.post("/admins", requireFields(["name", "email", "password"]), createAdmin);
router.post(
  "/admins/invite",
  protect,
  adminOnly,
  requireFields(["name", "email", "password"]),
  createAdmin,
);

export default router;
