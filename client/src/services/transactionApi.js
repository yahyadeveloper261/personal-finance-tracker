import { BASE_URL } from "./api";
import { apiFetch } from "./apiClient";

// Create Transaction
export const createTransaction = async (formData) => {
  return await apiFetch(`${BASE_URL}/create/transaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};

// Get Transactions
export const getTransactions = async ({
  page,
  limit,
  search,
  type,
  category,
  startDate,
  endDate,
}) => {
  const params = new URLSearchParams({
    page: page ?? "",
    limit: limit ?? "",
    search: search ?? "",
    type: type ?? "",
    category: category ?? "",
    startDate: startDate ?? "",
    endDate: endDate ?? "",
  });

  return await apiFetch(`${BASE_URL}/my/transactions?${params.toString()}`, {
    method: "GET",
  });
};

// Get Expense Categories
export const getExpenseCategories = async () => {
  return await apiFetch(`${BASE_URL}/expense/categories`, {
    method: "GET",
  });
};

// Update Transaction
export const updateTransaction = async (id, formData) => {
  return await apiFetch(`${BASE_URL}/transaction/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
};

// Delete Transaction
export const deleteTransaction = async (id) => {
  return await apiFetch(`${BASE_URL}/transaction/${id}`, {
    method: "DELETE",
  });
};
