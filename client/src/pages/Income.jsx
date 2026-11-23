import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardApi";
import { getTransactions, deleteTransaction } from "../services/transactionApi";

import {
  Wallet,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CircleDollarSign,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Income() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [totalIncomeAll, setTotalIncomeAll] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const limit = 8;
  const navigate = useNavigate();
  // Get all-time income from Dashboard API
  useEffect(() => {
    const fetchTotalIncome = async () => {
      try {
        const data = await getDashboard();
        setTotalIncomeAll(Number(data?.totalIncome ?? 0));
      } catch (error) {
        console.log(error);
      }
    };

    fetchTotalIncome();
  }, []);

  // Get current page transactions
  useEffect(() => {
    const getIncome = async () => {
      try {
        setLoading(true);

        const data = await getTransactions({
          page,
          limit,
          search,
          type: "income",
          category,
          startDate,
          endDate,
        });

        const newItems = Array.isArray(data?.transactions)
          ? data.transactions
          : [];

        setIncomeTransactions(newItems);
        setTotalPages(data?.totalPages ?? 1);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getIncome();
  }, [page, search, category, startDate, endDate]);

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this transaction?",
    );

    if (!ok) return;

    try {
      await deleteTransaction(id);

      setIncomeTransactions((prev) => prev.filter((item) => item._id !== id));

      alert("Transaction deleted successfully!");
    } catch (error) {
      alert("Failed to delete the transaction. Please try again.");
    }
  };
  // Current page income
  const totalIncome = incomeTransactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasFilters = search || category || startDate || endDate;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Income
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage and track all your income transactions.
          </p>
        </div>

        <div className="flex items-center gap-2 w-fit rounded-xl bg-emerald-50 px-4 py-2.5 text-emerald-700">
          <TrendingUp size={18} />
          <span className="text-sm font-semibold">Income Overview</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Current Page Income */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-emerald-100">
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-white/10" />
          <div className="absolute right-12 -bottom-16 w-36 h-36 rounded-full bg-white/10" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-emerald-100 font-medium">
                Current Page Income
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mt-3 break-all">
                Rs. {totalIncome.toLocaleString()}
              </h2>

              <p className="text-xs text-emerald-100 mt-2">
                Income on this page
              </p>
            </div>

            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <TrendingUp size={27} />
            </div>
          </div>
        </div>

        {/* Total Income */}
        <div className="relative overflow-hidden bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-slate-500 font-medium">Total Income</p>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 break-all">
                Rs. {totalIncomeAll.toLocaleString()}
              </h2>

              <p className="text-xs text-slate-400 mt-2">
                All income transactions
              </p>
            </div>

            <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CircleDollarSign size={28} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Income History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Header and Filters */}
        <div className="p-4 sm:p-5 lg:p-6 border-b border-slate-100 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Income History
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Search and filter your income records.
              </p>
            </div>

            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2 w-fit">
              <SlidersHorizontal size={16} />
              <span className="text-xs font-semibold">Filters</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">
                Search Transaction
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search income..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full min-w-0 pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 hover:border-emerald-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">
                Category
              </label>

              <div className="relative">
                <SlidersHorizontal
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />

                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none transition-all hover:border-emerald-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                  <option value="Rental Income">Rental Income</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Other Income">Other Income</option>
                </select>

                <ChevronRight
                  size={17}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CalendarDays size={15} className="text-emerald-500" />
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);

                  if (endDate && e.target.value > endDate) {
                    setEndDate("");
                  }
                }}
                className="w-full min-w-0 appearance-none px-3 sm:px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium outline-none transition-all hover:border-emerald-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 cursor-pointer"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CalendarDays size={15} className="text-emerald-500" />
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="w-full min-w-0 appearance-none px-3 sm:px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium outline-none transition-all hover:border-emerald-300 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 cursor-pointer"
              />
            </div>
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="text-xs text-slate-500">
                Filters are applied to your income history.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
              >
                <X size={15} />
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Title</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-14">
                    <div className="flex justify-center">
                      <div className="w-9 h-9 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    </div>

                    <p className="text-slate-500 mt-3 text-sm">
                      Loading income...
                    </p>
                  </td>
                </tr>
              ) : incomeTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-14">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center">
                      <Wallet size={27} className="text-slate-300" />
                    </div>

                    <p className="text-slate-700 font-semibold mt-3">
                      No income transactions found
                    </p>

                    <p className="text-slate-400 text-xs mt-1">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                incomeTransactions.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-emerald-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {item.title}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <span className="inline-flex px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Income
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} className="text-slate-400" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                      + Rs. {Number(item.amount).toLocaleString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => navigate(`/transactions/${item._id}`)}
                          className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
                        >
                          Edit
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 hover:text-rose-700 transition-all duration-200"
                        >
                          Delete
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
        <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1 || loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page >= totalPages || loading}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
