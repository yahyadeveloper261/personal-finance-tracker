import { useState, useEffect, useRef } from "react";
import {
  createBudget,
  getBudget,
  deleteBudget,
  updateBudget,
} from "../services/budgetApi";

import {
  Wallet,
  Utensils,
  ShoppingBag,
  Car,
  Receipt,
  HeartPulse,
  LayoutGrid,
  Save,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
export default function Budget() {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [budget, setBudget] = useState([]);
  const [totalBud, setTotalBud] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();
  const formRef = useRef(null);
  const categories = [
    { name: "Food", icon: Utensils },
    { name: "Shopping", icon: ShoppingBag },
    { name: "Transport", icon: Car },
    { name: "Bills", icon: Receipt },
    { name: "Health", icon: HeartPulse },
    { name: "Others", icon: LayoutGrid },
  ];

  // For Budget Updation
  useEffect(() => {
    if (!id) return;

    const updation = async () => {
      try {
        // Pehle current page par budget search karo
        const res = await getBudget(page, 5);

        let match = res.budget.find((item) => item._id === id);

        // Agar current page par nahi mila to baqi pages check karo
        if (!match) {
          for (let p = 1; p <= res.totalPages; p++) {
            if (p === page) continue;

            const result = await getBudget(p, 5);

            match = result.budget.find((item) => item._id === id);

            if (match) break;
          }
        }

        if (match) {
          setCategory(match.category);
          setAmount(match.amount);
        }
      } catch (error) {
        alert(error.message || "Failed to fetch budget details");
      }
    };

    updation();
  }, [id]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const res = await getBudget(page, 5);
        setTotalBud(res?.totalBudget);
        setTotalPages(res?.totalPages);
        setBudget(res?.budget || []);
      } catch (error) {
        alert(error.message || "Failed to fetch budgets");
      }
    };

    fetchBudgets();
  }, [page]);
  // Budget Creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const now = new Date();

      const formData = {
        category,
        amount: Number(amount),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      };

      let res;

      if (id) {
        res = await updateBudget(id, formData);
        alert("Budget updated successfully!");
        navigate("/budget");
      } else {
        res = await createBudget(formData);
        alert(res.message || "Budget created successfully!");
      }

      setAmount("");

      const updated = await getBudget(page, 5);

      setBudget(updated?.budget || []);
      setTotalBud(updated?.totalBudget || 0);
      setTotalPages(updated?.totalPages || 1);
    } catch (error) {
      alert(error.message || "Failed to save budget");
    } finally {
      setLoading(false);
    }
  };

  // Delete Budget
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget? This action cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      await deleteBudget(id);

      setBudget((prev) => prev.filter((item) => item._id !== id));

      alert("Budget deleted successfully!");
    } catch (error) {
      alert(error.message || "Failed to delete the budget. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-emerald-100 rounded-xl">
            <Wallet className="text-emerald-600" size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Set Monthly Budget
            </h1>
            <p className="text-sm text-slate-500">
              Manage your monthly spending limits
            </p>
          </div>
        </div>
      </div>

      {/* Total Budget Summary */}
      <div className="mb-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-medium">
              Total Monthly Budget
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Rs. {totalBud.toLocaleString()}
            </h2>

            <p className="text-emerald-100 text-xs mt-2">
              {budget.length} Budgets Created
            </p>
          </div>

          <div className="p-4 bg-white/20 rounded-xl">
            <Wallet size={30} />
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div
        ref={formRef}
        className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-7">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Select Category
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((item) => {
                const Icon = item.icon;
                const active = category === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCategory(item.name)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                      active
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-100"
                        : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={23} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Budget Amount
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                Rs.
              </span>

              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter your budget amount"
                className="w-full border border-slate-200 rounded-xl py-4 pl-14 pr-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition"
                required
              />
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Enter your spending limit for this category.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-semibold transition"
          >
            <Save size={19} />
            {loading ? "Saving..." : "Save Budget"}
          </button>
        </form>
      </div>

      {/* Saved Budgets */}
      <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Your Monthly Budgets
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              View and manage your category-wise budgets.
            </p>
          </div>

          <span className="w-fit px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-semibold">
            {budget.length} Budgets
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Month</th>
                <th className="px-6 py-4 font-semibold">Year</th>
                <th className="px-6 py-4 font-semibold text-right">
                  Budget Amount
                </th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {budget.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12">
                    <Wallet size={30} className="mx-auto text-slate-300" />

                    <p className="text-slate-700 font-semibold mt-3">
                      No budgets found
                    </p>

                    <p className="text-slate-400 text-xs mt-1">
                      Create your first monthly budget.
                    </p>
                  </td>
                </tr>
              ) : (
                budget.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-emerald-50/40 transition-colors"
                  >
                    {/* Category */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          {(() => {
                            const Icon =
                              categories.find(
                                (cat) => cat.name === item.category,
                              )?.icon || Wallet;

                            return <Icon size={19} />;
                          })()}
                        </div>

                        <span className="font-semibold text-slate-800">
                          {item.category}
                        </span>
                      </div>
                    </td>

                    {/* Month */}
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(item.year, item.month - 1).toLocaleString(
                        "en-US",
                        {
                          month: "long",
                        },
                      )}
                    </td>

                    {/* Year */}
                    <td className="px-6 py-4 text-slate-600">{item.year}</td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                      Rs. {Number(item.amount).toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigate(`/budget/${item._id}`);

                            setTimeout(() => {
                              formRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }, 100);
                          }}
                          className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition"
                        >
                          <span className="flex items-center gap-1">
                            <Pencil size={13} />
                            Edit
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="px-3 py-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition"
                        >
                          <span className="flex items-center gap-1">
                            <Trash2 size={13} />
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-100">
          {/* Page Info */}
          <p className="text-sm text-slate-500">
            Showing page{" "}
            <span className="font-semibold text-slate-800">{page}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all"
            >
              ← Previous
            </button>

            <span className="min-w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-sm">
              {page}
            </span>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 disabled:hover:border-slate-200 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
