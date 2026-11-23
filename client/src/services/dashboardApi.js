import { BASE_URL } from "./api";
import { apiFetch } from "./apiClient";

export const getDashboard = async () => {
  return await apiFetch(`${BASE_URL}/dashboard`, {
    method: "GET",
  });
};
