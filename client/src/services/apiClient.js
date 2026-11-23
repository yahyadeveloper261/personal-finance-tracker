import { refreshAccessToken } from "./authApi";

let refreshPromise = null;

export const apiFetch = async (url, options = {}) => {
  const sendRequest = (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  };

  let token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Access token missing. Please login again.");
  }

  let res = await sendRequest(token);

  // Access token expire hone par
  if (res.status === 401) {
    try {
      // Ek hi refresh request chalegi
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

      // Original request dobara send
      res = await sendRequest(token);
    } catch (error) {
      localStorage.removeItem("token");
      throw error;
    }
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
