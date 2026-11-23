import { useEffect, useState } from "react";

// API Services
import { getDashboard } from "../services/dashboardApi";
import {
  getTransactions,
  deleteTransaction,
  getExpenseCategories,
} from "../services/transactionApi";
import { getBudget } from "../services/budgetApi";

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
  const [budgetData, setBudgetData] = useState([]);
  const [categoryExpense, setCategoryExpense] = useState([]);
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

  // Chart Colors
  const colors = ["#10B981", "#8B5CF6", "#F59E0B", "#3B82F6", "#F472B6"];

  // Expense Categories Aggregation
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await getExpenseCategories();

        setCategoryExpense(res.categories || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpense();
  }, []);

  // Convert Aggregation Data for Chart
  const categoryData = categoryExpense.map((item, index) => ({
    name: item._id || "Others",
    value: Number(item.total),
    color: colors[index % colors.length],
    percentage: totalExpense
      ? Math.round((Number(item.total) / totalExpense) * 100)
      : 0,
  }));

  // Get Budget
  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const res = await getBudget();
        setBudgetData(res.budget || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBudget();
  }, []);

  // Get Transactions with Pagination
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
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [page, search, type, category, startDate, endDate]);

  // Get Dashboard Data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Delete Transaction
  const handleDelete = async (id) => {
    const ok = window.confirm("Do you want to delete?");

    if (!ok) return;

    try {
      await deleteTransaction(id);

      setTransactions((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      alert("Transaction delete failed");
    }
  };

  // Monthly Income vs Expense
  const monthlyTotals = {};

  transactions.forEach((item) => {
    const date = new Date(item.date);

    if (isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthlyTotals[key]) {
      monthlyTotals[key] = {
        month: date.toLocaleString("en-US", {
          month: "short",
        }),
        income: 0,
        expense: 0,
        year: date.getFullYear(),
        monthIndex: date.getMonth(),
      };
    }

    if (item.type === "income") {
      monthlyTotals[key].income += Number(item.amount);
    } else if (item.type === "expense") {
      monthlyTotals[key].expense += Number(item.amount);
    }
  });

  const allChartData = Object.values(monthlyTotals).sort(
    (a, b) => a.year - b.year || a.monthIndex - b.monthIndex,
  );

  const chartData = allChartData.slice(-6);
  const yearlyData = allChartData.slice(-12);

  const displayedChart =
    range === "6M" ? chartData : range === "1Y" ? yearlyData : allChartData;

  // Budget Calculation
  const budget = budgetData.reduce((sum, item) => sum + Number(item.amount), 0);
  const spent = transactions
    .filter((item) => {
      const date = new Date(item.date);
      const now = new Date();

      return (
        item.type === "expense" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const remaining = budget - spent;

  const budgetPercent =
    budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;

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
