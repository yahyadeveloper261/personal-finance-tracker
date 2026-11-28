import { BASE_URL } from "./api";
import { apiFetch } from "./apiClient";
export const register = async (formData) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data.errors?.[0]?.message || data.message || "Registration failed";

    throw new Error(message);
  }

  return data;
};

export const login = async (formData) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.errors?.[0]?.message || data.message || "Login failed",
    );
  }

  return data;
};

// ================= REFRESH ACCESS TOKEN =================

export const refreshAccessToken = async () => {
  const res = await fetch(`${BASE_URL}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Session expired");
  }

  return data;
};

export const logoutUser = async () => {
  try {
    await apiFetch(`${BASE_URL}/logout`, {
      method: "POST",
    });
  } finally {
    localStorage.removeItem("token");
  }
};

export const getMe = async () => {
  return await apiFetch(`${BASE_URL}/me`, {
    method: "GET",
  });
};
