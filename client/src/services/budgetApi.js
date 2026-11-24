import { BASE_URL } from "./api";
import { apiFetch } from "./apiClient";

// Create Budget
export const createBudget = async (formData) => {
  return await apiFetch(`${BASE_URL}/create/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};

// Get Budget

export const getBudget = async (page = 1, limit = 5) => {
  return await apiFetch(
    `${BASE_URL}/my/budgets?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
};

// Delete Budget
export const deleteBudget = async (id) => {
  return await apiFetch(`${BASE_URL}/budget/${id}`, {
    method: "DELETE",
  });
};

// Update Budget
export const updateBudget = async (id, formData) => {
  return await apiFetch(`${BASE_URL}/budget/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};
