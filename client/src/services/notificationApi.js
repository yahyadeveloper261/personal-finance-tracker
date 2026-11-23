import { BASE_URL } from "./api";
import { apiFetch } from "./apiClient";

export const getNotifications = async () => {
  return await apiFetch(`${BASE_URL}/notifications`);
};

export const markNotificationAsRead = async (id) => {
  return await apiFetch(`${BASE_URL}/notifications/read/${id}`, {
    method: "PUT",
  });
};

export const markAllNotificationsAsRead = async () => {
  return await apiFetch(`${BASE_URL}/notifications/read-all`, {
    method: "PUT",
  });
};
