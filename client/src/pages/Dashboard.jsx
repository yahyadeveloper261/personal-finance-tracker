import { useEffect, useState } from "react";
import { exportCSV } from "../utils/exportCSV";

// API Services
import { getDashboard } from "../services/dashboardApi";
import {
  getTransactions,
  deleteTransaction,
  getExpenseCategories,
  getMonthlyTransactionStats,
} from "../services/transactionApi";

// Dashboard Components
import SummaryCards from "../components/dashboard/SummaryCards";
import FinancialInsights from "../components/dashboard/FinancialInsights";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import ExpenseCategoryChart from "../components/dashboard/ExpenseCategoryChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import MonthlyBudgetCard from "../components/dashboard/MonthlyBudgetCard";

// Icons
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CalendarDays,
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("6M");

  const [transactions, setTransactions] = useState([]);
  const [categoryExpense, setCategoryExpense] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const limit = 8;

  // Dashboard Summary Data
  const totalIncome = Number(data?.totalIncome ?? 0);
  const totalExpense = Number(data?.totalExpense ?? 0);
  const totalBalance = Number(data?.totalBalance ?? 0);
  const totalSavings = totalIncome - totalExpense;

  // Budget Data From Backend
  const budget = Number(data?.totalBudget || 0);
  const spent = Number(data?.currentMonthExpense || 0);
  const budgetPercent = Number(data?.budgetPercent || 0);
  const remaining = budget - spent;

  // Chart Colors
  const colors = ["#10B981", "#8B5CF6", "#F59E0B", "#3B82F6", "#F472B6"];

  // Get Dashboard Data
  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setData(res);
    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  // Get Expense Categories
  const fetchExpense = async () => {
    try {
      const res = await getExpenseCategories();
      setCategoryExpense(res.categories || []);
    } catch (error) {
      console.log("Expense Categories Error:", error);
    }
  };

  // Get Monthly Transaction Stats
  const fetchMonthlyStats = async () => {
    try {
      const res = await getMonthlyTransactionStats(range);
      setMonthlyStats(res.monthlyData || []);
    } catch (error) {
      console.log("Monthly Stats Error:", error);
    }
  };

  // Initial Dashboard Data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await Promise.all([fetchDashboard(), fetchExpense()]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Monthly Chart Data
  useEffect(() => {
    fetchMonthlyStats();
  }, [range]);

  // Reset Pagination When Filters Change
  useEffect(() => {
    setPage(1);
    setTransactions([]);
  }, [search, type, category, startDate, endDate]);

  // Get Transactions With Pagination
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await getTransactions({
          type,
          category,
          page,
          search,
          limit,
          startDate,
          endDate,
        });

        const newItems = Array.isArray(res?.transactions)
          ? res.transactions
          : [];

        setTransactions((prev) =>
          page === 1 ? newItems : [...prev, ...newItems],
        );

        setTotalPages(res?.totalPages ?? 1);
      } catch (error) {
        console.log("Transaction Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [page, search, type, category, startDate, endDate]);

  // Delete Transaction
  const handleDelete = async (id) => {
    const ok = window.confirm("Do you want to delete?");

    if (!ok) return;

    try {
      await deleteTransaction(id);

      setTransactions((prev) => prev.filter((item) => item._id !== id));

      // Refresh Dashboard Data
      await Promise.all([
        fetchDashboard(),
        fetchExpense(),
        fetchMonthlyStats(),
      ]);
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Transaction delete failed");
    }
  };

  // Export Transactions To CSV
  const handleExportCSV = async () => {
    try {
      const exportLimit = 100;

      const firstResponse = await getTransactions({
        type,
        category,
        search,
        startDate,
        endDate,
        page: 1,
        limit: exportLimit,
      });

      let allTransactions = firstResponse.transactions || [];
      const pages = firstResponse.totalPages || 1;

      for (let currentPage = 2; currentPage <= pages; currentPage++) {
        const response = await getTransactions({
          type,
          category,
          search,
          startDate,
          endDate,
          page: currentPage,
          limit: exportLimit,
        });

        allTransactions = [
          ...allTransactions,
          ...(response.transactions || []),
        ];
      }

      exportCSV(allTransactions, "dashboard-transactions");
    } catch (error) {
      console.error("CSV Export Error:", error);
      alert("Failed to export transactions");
    }
  };

  // Expense Categories Chart Data
  const categoryData = categoryExpense.map((item, index) => ({
    name: item._id || "Others",
    value: Number(item.total),
    color: colors[index % colors.length],
    percentage: totalExpense
      ? Math.round((Number(item.total) / totalExpense) * 100)
      : 0,
  }));

  // Monthly Income vs Expense Chart Data
  const displayedChart = monthlyStats.map((item) => ({
    month: new Date(Date.UTC(item.year, item.month - 1, 1)).toLocaleString(
      "en-US",
      {
        month: "short",
      },
    ),
    income: Number(item.income || 0),
    expense: Number(item.expense || 0),
    year: item.year,
    monthIndex: item.month,
  }));

  // Dashboard Summary Cards
  const summary = [
    {
      title: "Total Balance",
      amount: totalBalance,
      icon: Wallet,
      bg: "bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900",
      iconBg: "bg-white/15",
      iconColor: "text-white",
      textColor: "text-white",
      subColor: "text-emerald-100",
      trendColor: "#A7F3D0",
      trend: [20, 30, 25, 45, 35, 60, 75],
      badge: "Available",
      badgeBg: "bg-white/15 text-white",
    },
    {
      title: "Total Income",
      amount: totalIncome,
      icon: TrendingUp,
      bg: "bg-gradient-to-br from-green-50 to-emerald-100",
      iconBg: "bg-green-500",
      iconColor: "text-white",
      textColor: "text-slate-900",
      subColor: "text-slate-500",
      trendColor: "#16A34A",
      trend: [25, 40, 30, 55, 45, 65, 75],
      badge: "Income",
      badgeBg: "bg-green-100 text-green-700",
    },
    {
      title: "Total Expense",
      amount: totalExpense,
      icon: TrendingDown,
      bg: "bg-gradient-to-br from-rose-50 to-pink-100",
      iconBg: "bg-rose-500",
      iconColor: "text-white",
      textColor: "text-slate-900",
      subColor: "text-slate-500",
      trendColor: "#F43F5E",
      trend: [20, 40, 30, 55, 35, 50, 70],
      badge: "Spending",
      badgeBg: "bg-rose-100 text-rose-700",
    },
    {
      title: "Total Savings",
      amount: totalSavings,
      icon: PiggyBank,
      bg: "bg-gradient-to-br from-violet-50 to-purple-100",
      iconBg: "bg-violet-600",
      iconColor: "text-white",
      textColor: "text-slate-900",
      subColor: "text-slate-500",
      trendColor: "#8B5CF6",
      trend: [20, 35, 30, 45, 55, 50, 75],
      badge: "Saved",
      badgeBg: "bg-violet-100 text-violet-700",
    },
  ];

  if (loading) {
    return <div className="p-8 text-slate-500">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome Back,
              <span className="ml-2 bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                {data?.user?.name || "User"}
              </span>
              👋
            </h1>
          </div>

          <p className="text-sm text-slate-500 mt-2">
            Here's your financial overview. Let's manage your money smarter.
          </p>
        </div>

        <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm hover:border-emerald-400 transition">
          <CalendarDays size={18} className="text-emerald-600" />
          Monthly Overview
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Financial Insights */}
      <FinancialInsights
        totalSavings={totalSavings}
        budgetPercent={budgetPercent}
        remaining={remaining}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <IncomeExpenseChart
          displayedChart={displayedChart}
          range={range}
          setRange={setRange}
        />

        <ExpenseCategoryChart
          categoryData={categoryData}
          totalExpense={totalExpense}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
        <RecentTransactions
          transactions={transactions}
          search={search}
          setSearch={setSearch}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          handleDelete={handleDelete}
          handleExportCSV={handleExportCSV}
          type={type}
          setType={setType}
          category={category}
          setCategory={setCategory}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        <MonthlyBudgetCard
          budget={budget}
          spent={spent}
          remaining={remaining}
          budgetPercent={budgetPercent}
        />
      </div>
    </div>
  );
}
