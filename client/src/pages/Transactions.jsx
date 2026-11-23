import React, { useEffect, useState } from "react";
import { createTransaction } from "../services/transactionApi";
import { getTransactions, updateTransaction } from "../services/transactionApi";
import { useNavigate } from "react-router-dom";
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
import { useParams } from "react-router-dom";

export default function Transactions() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    const updation = async () => {
      const match = await getTransactions({
        page: 1,
        limit: 1000,
        search: "",
        type: "",
        category: "",
        startDate: "",
        endDate: "",
      });

      const transaction = match.transactions.find((trans) => trans._id === id);
      if (transaction) {
        setTitle(transaction.title);
        setType(transaction.type);
        setAmount(transaction.amount);
        setCategory(transaction.category);
        setDescription(transaction.description);
        setDate(new Date(transaction.date).toISOString().split("T")[0]);
      }
    };
    updation();
  }, [id]);

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

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    setCategory(newType === "income" ? "Salary" : "Food & Dining");
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = {
        title,
        type,
        amount: Number(amount),
        category,
        description,
        date,
      };
      id
        ? await updateTransaction(id, formData)
        : await createTransaction(formData);

      id
        ? alert("Transaction successfully updated")
        : alert("Transaction successfullya added");

      setTitle("");
      setAmount("");
      setDescription("");
      setDate("");
      setType("income");
      setCategory("Salary");

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full mt-2 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-slate-700 placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-[#f5f7fc] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 mb-5
  bg-white border border-slate-200 rounded-xl
  text-slate-600 text-sm font-semibold
  shadow-sm hover:shadow-md hover:border-emerald-300
  hover:text-emerald-700 transition-all duration-300"
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

            <form onSubmit={handleTransaction} className="space-y-5">
              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Transaction Title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Monthly Salary"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputStyle}
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Transaction Type
                </label>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleTypeChange({ target: { value: "income" } })
                    }
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
                    onClick={() =>
                      handleTypeChange({ target: { value: "expense" } })
                    }
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
                    value={amount}
                    required
                    onChange={(e) => setAmount(e.target.value)}
                    className={`${inputStyle} pl-14 text-lg font-bold`}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Tag size={16} />
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputStyle}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CalendarDays size={16} />
                  Transaction Date
                </label>

                <input
                  type="date"
                  value={date}
                  required
                  onChange={(e) => setDate(e.target.value)}
                  className={inputStyle}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FileText size={16} />
                  Description
                </label>

                <textarea
                  rows="3"
                  placeholder="Add some details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Adding Transaction...
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
