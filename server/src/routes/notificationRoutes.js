import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const notification = express.Router();

notification.get("/", authMiddleware, getNotifications);

notification.put("/read/:id", authMiddleware, markNotificationAsRead);

notification.put("/read-all", authMiddleware, markAllNotificationsAsRead);

export default notification;
