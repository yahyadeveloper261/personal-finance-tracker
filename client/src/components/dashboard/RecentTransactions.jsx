import { useNavigate } from "react-router-dom";

import {
  Search,
  List,
  Wallet,
  ShoppingCart,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  ReceiptText,
  CalendarDays,
} from "lucide-react";

export default function RecentTransactions({
  transactions,
  search,
  setSearch,
  page,
  setPage,
  totalPages,
  handleDelete,
  type,
  setType,
  category,
  setCategory,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const navigate = useNavigate();

  return (
    <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200/70 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-200">
              <List size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Transactions
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manage your latest financial activities
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter Heading */}
        <div className="flex items-center gap-2 mt-7 mb-4">
          <Filter size={16} className="text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-700">
            Filter Transactions
          </h3>
          <div className="flex-1 h-px bg-slate-100 ml-2" />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">
              Transaction Type
            </label>

            <div className="relative">
              <ArrowUpDown
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
              />

              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                }}
                className="w-full appearance-none pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 cursor-pointer transition-all"
              >
                <option value="">All Transactions</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">
              Category
            </label>

            <div className="relative">
              <Filter
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
              />

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className="w-full appearance-none pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 cursor-pointer transition-all"
              >
                <option value="">All Categories</option>

                <optgroup label="Expense">
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Bills & Utilities">Bills & Utilities</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="Health & Medical">Health & Medical</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Travel">Travel</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Other">Other</option>
                </optgroup>

                <optgroup label="Income">
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Business">Business</option>
                  <option value="Investment">Investment</option>
                  <option value="Rental Income">Rental Income</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Other Income">Other Income</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">
              Start Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
              />

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all cursor-pointer"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">
              End Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-600 pointer-events-none"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider">
              <th className="py-4 px-6 font-semibold">Transaction</th>
              <th className="py-4 px-4 font-semibold">Category</th>
              <th className="py-4 px-4 font-semibold">Date</th>
              <th className="py-4 px-4 font-semibold">Amount</th>
              <th className="py-4 px-4 font-semibold">Type</th>
              <th className="py-4 px-6 text-center font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr
                key={item._id}
                className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/40 transition duration-200 group"
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-xl ${
                        item.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      {item.type === "income" ? (
                        <Wallet size={19} />
                      ) : (
                        <ShoppingCart size={19} />
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.description || "Transaction"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-4">
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                    {item.category}
                  </span>
                </td>

                <td className="py-5 px-4 text-slate-500 text-xs font-medium">
                  {new Date(item.date).toLocaleDateString()}
                </td>

                <td
                  className={`py-5 px-4 font-bold ${
                    item.type === "income"
                      ? "text-emerald-600"
                      : "text-rose-500"
                  }`}
                >
                  {item.type === "income" ? "+" : "-"}
                  {Number(item.amount).toLocaleString()}
                </td>

                <td className="py-5 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      item.type === "income"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.type === "income"
                          ? "bg-emerald-500"
                          : "bg-rose-500"
                      }`}
                    />
                    {item.type}
                  </span>
                </td>

                <td className="py-5 px-6">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => navigate(`/transactions/${item._id}`)}
                      title="Edit Transaction"
                      className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition duration-200"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      title="Delete Transaction"
                      className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-2xl bg-slate-100 text-slate-400">
                      <ReceiptText size={28} />
                    </div>
                    <p className="font-semibold text-slate-600">
                      No transactions found
                    </p>
                    <p className="text-xs text-slate-400">
                      Try changing your search or filters
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-t border-slate-100">
        <p className="text-sm text-slate-500">
          Page <span className="font-bold text-slate-800">{page}</span> of{" "}
          <span className="font-bold text-slate-800">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={17} />
            Previous
          </button>

          <span className="min-w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white text-sm font-bold shadow-md shadow-emerald-100">
            {page}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page >= totalPages}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
