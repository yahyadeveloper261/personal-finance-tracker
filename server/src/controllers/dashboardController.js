import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Current Pakistan Month and Year
    const now = new Date();

    const dateParts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Karachi",
      year: "numeric",
      month: "numeric",
    }).formatToParts(now);

    const currentYear = Number(
      dateParts.find((part) => part.type === "year").value,
    );

    const currentMonth = Number(
      dateParts.find((part) => part.type === "month").value,
    );

    // Dashboard Income and Expense Aggregation
    const transactionStats = await Transaction.aggregate([
      {
        $match: {
          user: user._id,
        },
      },
      {
        $group: {
          _id: "$type",
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalIncome =
      transactionStats.find((item) => item._id === "income")?.total || 0;

    const totalExpense =
      transactionStats.find((item) => item._id === "expense")?.total || 0;

    const totalBalance = totalIncome - totalExpense;

    // Current Month Budget Aggregation
    const monthStart = new Date(
      Date.UTC(currentYear, currentMonth - 1, 1) - 5 * 60 * 60 * 1000,
    );

    const monthEnd = new Date(
      Date.UTC(currentYear, currentMonth, 1) - 5 * 60 * 60 * 1000,
    );

    const [budgetStats, expenseStats] = await Promise.all([
      Budget.aggregate([
        {
          $match: {
            user: user._id,
            month: currentMonth,
            year: currentYear,
          },
        },
        {
          $group: {
            _id: null,
            totalBudget: { $sum: "$amount" },
          },
        },
      ]),

      Transaction.aggregate([
        {
          $match: {
            user: user._id,
            type: "expense",
            date: {
              $gte: monthStart,
              $lt: monthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const totalBudget = budgetStats[0]?.totalBudget || 0;
    const currentMonthExpense = expenseStats[0]?.totalSpent || 0;

    const budgetPercent =
      totalBudget > 0
        ? Math.min(Math.round((currentMonthExpense / totalBudget) * 100), 100)
        : 0;

    return res.status(200).json({
      success: true,
      message: `Welcome Back ${user.name}`,
      user,
      totalIncome,
      totalExpense,
      totalBalance,
      totalBudget,
      currentMonthExpense,
      budgetPercent,
    });
  } catch (error) {
    console.log("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
