import { refreshAccessToken } from "./authApi";

let refreshPromise = null;

export const apiFetch = async (url, options = {}) => {
  const sendRequest = (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });
  };

  let token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Access token missing. Please login again.");
  }

  let res = await sendRequest(token);

  // Logout par automatic refresh attempt nahi karna
  const isLogoutRequest = url.includes("/logout");

  if (res.status === 401 && !isLogoutRequest) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
          .then((data) => {
            localStorage.setItem("token", data.accessToken);
            return data.accessToken;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      token = await refreshPromise;
      res = await sendRequest(token);
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  }

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.errors = data.errors || [];
    throw error;
  }

  return data;
};
