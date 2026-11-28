import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
} from "../services/transactionApi";
import { useNavigate, useParams } from "react-router-dom";

import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Tag,
  ArrowLeft,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";

export default function Transactions() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError: setFieldError,
    clearErrors,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      type: "income",
      amount: "",
      category: "Salary",
      description: "",
      date: "",
    },
  });

  // Watch form values for live preview
  const title = watch("title") || "";
  const type = watch("type") || "income";
  const amount = watch("amount") || "";
  const category = watch("category") || "";
  const description = watch("description") || "";
  const date = watch("date") || "";

  // Fetch transaction for editing
  useEffect(() => {
    if (!id) return;

    const updation = async () => {
      try {
        const match = await getTransactions({
          page: 1,
          limit: 1000,
          search: "",
          type: "",
          category: "",
          startDate: "",
          endDate: "",
        });

        const transaction = match.transactions.find(
          (trans) => trans._id === id,
        );

        if (transaction) {
          reset({
            title: transaction.title || "",
            type: transaction.type || "income",
            amount: transaction.amount,
            category: transaction.category || "",
            description: transaction.description || "",
            date: transaction.date
              ? new Date(transaction.date).toISOString().split("T")[0]
              : "",
          });
        }
      } catch (error) {
        setError(error.message || "Failed to fetch transaction");
      }
    };

    updation();
  }, [id, reset]);

  // Categories
  const categories =
    type === "income"
      ? [
          "Salary",
          "Freelancing",
          "Business",
          "Investment",
          "Bonus",
          "Other Income",
        ]
      : [
          "Food & Dining",
          "Shopping",
          "Transport",
          "Bills & Utilities",
          "Rent",
          "Health",
          "Education",
          "Entertainment",
          "Groceries",
          "Other Expense",
        ];

  const handleTypeChange = (newType) => {
    const defaultCategory = newType === "income" ? "Salary" : "Food & Dining";

    setValue("type", newType, {
      shouldValidate: false,
      shouldDirty: true,
    });

    setValue("category", defaultCategory, {
      shouldValidate: false,
      shouldDirty: true,
    });

    clearErrors(["type", "category"]);
  };

  // Submit transaction
  const handleTransaction = async (formData) => {
    setError("");

    const payload = {
      title: formData.title.trim(),
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category.trim(),
      description: formData.description || "",
      date: formData.date,
    };

    try {
      if (id) {
        await updateTransaction(id, payload);
        alert("Transaction successfully updated");
      } else {
        await createTransaction(payload);
        alert("Transaction successfully added");
      }

      reset();
      navigate("/dashboard");
    } catch (error) {
      if (error.errors?.length) {
        let hasFieldError = false;

        error.errors.forEach((item) => {
          const allowedFields = [
            "title",
            "type",
            "amount",
            "category",
            "description",
            "date",
          ];

          if (allowedFields.includes(item.field)) {
            setFieldError(item.field, {
              type: "server",
              message: item.message,
            });

            hasFieldError = true;
          }
        });

        if (!hasFieldError) {
          setError(error.message || "Validation failed");
        }
      } else {
        setError(error.message || "Failed to save transaction");
      }
    }
  };

  const inputStyle =
    "w-full mt-2 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-700 placeholder:text-slate-400";

  const errorStyle = "text-red-500 text-xs mt-1.5";

  const invalidStyle = "border-red-500 focus:border-red-500 focus:ring-red-100";

  return (
    <div className="min-h-screen bg-[#f5f7fc] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 mb-5 bg-white border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold shadow-sm hover:shadow-md hover:border-emerald-300 hover:text-emerald-700 transition-all duration-300"
        >
          <ArrowLeft
            size={17}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-800">
                Transaction Details
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Enter the details of your transaction.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm mb-5">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit(handleTransaction)}
              className="space-y-5"
              noValidate
            >
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Transaction Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Monthly Salary"
                  maxLength={100}
                  {...register("title", {
                    required: "Title is required",
                    setValueAs: (value) => value.trim(),
                    maxLength: {
                      value: 100,
                      message: "Title cannot exceed 100 characters",
                    },
                    validate: (value) =>
                      value.trim().length > 0 || "Title is required",
                  })}
                  className={`${inputStyle} ${
                    errors.title ? invalidStyle : ""
                  }`}
                />

                {errors.title && (
                  <p className={errorStyle}>{errors.title.message}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Transaction Type
                </label>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => handleTypeChange("income")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold transition ${
                      type === "income"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-100 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <ArrowDownLeft size={20} />
                    Income
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTypeChange("expense")}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 font-semibold transition ${
                      type === "expense"
                        ? "border-rose-500 bg-rose-50 text-rose-700"
                        : "border-slate-100 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <ArrowUpRight size={20} />
                    Expense
                  </button>
                </div>

                <input
                  type="hidden"
                  {...register("type", {
                    required: "Transaction type is required",
                    validate: (value) =>
                      ["income", "expense"].includes(value) ||
                      "Please select a valid transaction type",
                  })}
                />

                {errors.type && (
                  <p className={errorStyle}>{errors.type.message}</p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Amount
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                    Rs.
                  </span>

                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    {...register("amount", {
                      required: "Amount is required",
                      setValueAs: (value) =>
                        value === "" ? "" : Number(value),
                      validate: {
                        positive: (value) =>
                          (Number.isFinite(value) && value > 0) ||
                          "Amount must be greater than 0",
                      },
                    })}
                    className={`${inputStyle} pl-14 text-lg font-bold ${
                      errors.amount ? invalidStyle : ""
                    }`}
                  />
                </div>

                {errors.amount && (
                  <p className={errorStyle}>{errors.amount.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Tag size={16} />
                  Category
                </label>

                <select
                  {...register("category", {
                    required: "Category is required",
                    validate: (value) =>
                      typeof value === "string" && value.trim().length > 0
                        ? true
                        : "Category is required",
                    maxLength: {
                      value: 50,
                      message: "Category cannot exceed 50 characters",
                    },
                  })}
                  className={`${inputStyle} ${
                    errors.category ? invalidStyle : ""
                  }`}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                {errors.category && (
                  <p className={errorStyle}>{errors.category.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CalendarDays size={16} />
                  Transaction Date
                </label>

                <input
                  type="date"
                  {...register("date", {
                    required: "Please select a transaction date",
                    validate: (value) =>
                      !Number.isNaN(Date.parse(value)) ||
                      "Please select a valid date",
                  })}
                  className={`${inputStyle} ${errors.date ? invalidStyle : ""}`}
                />

                {errors.date && (
                  <p className={errorStyle}>{errors.date.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText size={16} />
                  Description
                </label>

                <textarea
                  rows="3"
                  maxLength={500}
                  placeholder="Add some details..."
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  })}
                  className={`${inputStyle} resize-none ${
                    errors.description ? invalidStyle : ""
                  }`}
                />

                <div className="flex justify-between items-center mt-1.5">
                  {errors.description ? (
                    <p className={errorStyle}>{errors.description.message}</p>
                  ) : (
                    <span />
                  )}

                  <span className="text-xs text-slate-400">
                    {description.length}/500
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving Transaction...
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    {id ? "Update Transaction" : "Add Transaction"}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Side Preview */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-[#172554] via-[#1e40af] to-[#4338ca] rounded-3xl p-6 text-white shadow-xl shadow-blue-900/15">
              <div className="flex justify-between items-center">
                <div className="p-3 bg-white/15 rounded-xl">
                  <Wallet size={24} />
                </div>

                <span className="text-xs font-semibold bg-white/15 px-3 py-1.5 rounded-full">
                  LIVE PREVIEW
                </span>
              </div>

              <p className="text-blue-100 text-sm mt-7">Transaction Amount</p>

              <h2 className="text-3xl font-bold mt-2 break-all">
                Rs. {Number(amount || 0).toLocaleString("en-PK")}
              </h2>

              <div className="border-t border-white/20 mt-6 pt-5 flex justify-between items-center">
                <div>
                  <p className="text-blue-200 text-xs">Transaction Type</p>
                  <p className="font-semibold mt-1 capitalize">{type}</p>
                </div>

                <div
                  className={`p-3 rounded-xl ${
                    type === "income" ? "bg-emerald-400/20" : "bg-rose-400/20"
                  }`}
                >
                  {type === "income" ? (
                    <ArrowDownLeft size={23} />
                  ) : (
                    <ArrowUpRight size={23} />
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">
                Transaction Summary
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-400">Title</span>
                  <span className="font-semibold text-slate-700 text-right">
                    {title || "Not added"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="font-semibold text-slate-700">
                    {category}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Date</span>
                  <span className="font-semibold text-slate-700">
                    {date || "Not selected"}
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-slate-400 mb-1">Description</p>
                  <p className="text-slate-700 break-words">
                    {description || "No description added"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
