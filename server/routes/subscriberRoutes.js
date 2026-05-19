import express from "express";
import {
  deleteSubscriber,
  getSubscribers,
  subscribe,
} from "../controllers/subscriberController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", subscribe);
router.get("/", protect, adminOnly, getSubscribers);
router.delete("/:id", protect, adminOnly, deleteSubscriber);

export default router;
