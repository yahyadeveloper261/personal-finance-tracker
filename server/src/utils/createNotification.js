import Notification from "../models/Notification.js";

const createNotification = async ({ user, title, message, type, eventKey }) => {
  try {
    return await Notification.create({
      user,
      title,
      message,
      type,
      eventKey,
    });
  } catch (error) {
    // Same event ki duplicate notification ignore karo
    if (error.code === 11000) {
      return null;
    }

    throw error;
  }
};

export default createNotification;
