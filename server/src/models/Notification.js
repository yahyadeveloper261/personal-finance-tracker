import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["budget", "income", "expense", "exceeded", "summary", "savings"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    eventKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, eventKey: 1 }, { unique: true });

export default mongoose.model("Notification", notificationSchema);
