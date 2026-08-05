import express from "express";
import { ID } from "appwrite";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createDocument } from "../utils/appwriteCollections.js";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, phone = "", subject = "Website enquiry", body } = req.body;

    if (!name || !email || !body) {
      res.status(400);
      throw new Error("Name, email and message are required.");
    }

    const now = new Date().toISOString();
    const message = await createDocument("messages", ID.unique(), {
      name,
      email,
      phone,
      subject,
      body,
      status: "new",
      internalNotes: "",
      replies: JSON.stringify([]),
      unread: true,
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({ success: true, message });
  }),
);

export default router;
