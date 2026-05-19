import { Subscriber } from "../models/Subscriber.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const subscribe = asyncHandler(async (req, res) => {
  const { email, name, source } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const subscriber = await Subscriber.findOneAndUpdate(
    { email },
    { email, name, source, isActive: true },
    { new: true, upsert: true, runValidators: true },
  );

  res.status(201).json({ success: true, subscriber });
});

export const getSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find().sort("-createdAt");
  res.json({ success: true, subscribers });
});

export const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findByIdAndDelete(req.params.id);

  if (!subscriber) {
    res.status(404);
    throw new Error("Subscriber not found");
  }

  res.json({ success: true, message: "Subscriber deleted" });
});
