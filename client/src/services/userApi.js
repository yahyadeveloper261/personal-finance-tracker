import { BASE_URL } from "./api";
import { apiFetch } from "./apiClient";

export const profile = async () => {
  return await apiFetch(`${BASE_URL}/my/profile`, {
    method: "GET",
  });
};

export const updateImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return await apiFetch(`${BASE_URL}/updateProfile`, {
    method: "PUT",
    body: formData,
  });
};

export const updateProfile = async (name) => {
  return await apiFetch(`${BASE_URL}/updateName`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
};
