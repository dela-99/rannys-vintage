import mongoose, { Schema } from "mongoose";

const SupportTicketSchema = new Schema(
  {
    ticketId: { type: String, unique: true, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String },
    message: { type: String, required: true },
    category: {
      type: String,
      enum: ["Complaint", "Question", "Delivery", "Request", "General"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    adminReply: { type: String },
    repliedAt: { type: Date },
    repliedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export const SupportTicket = mongoose.model("SupportTicket", SupportTicketSchema);
