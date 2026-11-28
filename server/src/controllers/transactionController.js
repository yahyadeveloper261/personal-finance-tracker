import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import createNotification from "../utils/createNotification.js";
import { transactionSchema } from "../validators/financeSchema.js";
//===============================CreateTransaction====================================

export const createTransaction = async (req, res) => {
  try {
    const validation = transactionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { title, amount, type, category, description, date } =
      validation.data;

    // 1. Create Transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      description,
      date,
    });

    // 2. Transaction Added Notification
    try {
      await createNotification({
        user: req.user.id,
        title: type === "income" ? "Income Added" : "Expense Added",
        message: `${title} of Rs. ${Number(amount).toLocaleString()} was added successfully.`,
        type,
        eventKey: `transaction:${transaction._id}`,
      });

      // 3. Check Budget only for expenses
      if (type === "expense") {
        const transactionDate = transaction.date
          ? new Date(transaction.date)
          : new Date();

        const month = transactionDate.getMonth() + 1;
        const year = transactionDate.getFullYear();

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        // Find matching category budget
        const budget = await Budget.findOne({
          user: req.user.id,
          category,
          month,
          year,
        });

        if (budget && Number(budget.amount) > 0) {
          // Calculate total monthly expense in this category
          const transactions = await Transaction.find({
            user: req.user.id,
            type: "expense",
            category,
            date: {
              $gte: startDate,
              $lt: endDate,
            },
          }).select("amount");

          const totalSpent = transactions.reduce(
            (total, item) => total + Number(item.amount),
            0,
          );

          const percentage = (totalSpent / Number(budget.amount)) * 100;

          // 80% Budget Alert
          if (percentage >= 80) {
            await createNotification({
              user: req.user.id,
              title: "Budget Alert",
              message: `Your ${category} budget is ${Math.round(
                percentage,
              )}% used.`,
              type: "budget",
              eventKey: `budget:${budget._id}:${year}:${month}:80`,
            });
          }

          // 100% Budget Exceeded
          if (percentage >= 100) {
            await createNotification({
              user: req.user.id,
              title: "Budget Exceeded",
              message: `Your ${category} budget has reached or exceeded its limit.`,
              type: "exceeded",
              eventKey: `budget:${budget._id}:${year}:${month}:100`,
            });
          }
        }
      }
    } catch (notificationError) {
      console.error("Notification Error:", notificationError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//=============================getTransactions======================================
export const getTransactions = async (req, res) => {
  try {
    const { type, category, search, page, limit, startDate, endDate } =
      req.query;
    const currentPage = Number(page) || 1;
    const itemPerPage = Number(limit) || 5;

    const skip = (currentPage - 1) * itemPerPage;

    const filter = { user: req.user.id };
    if (type) {
      filter.type = type;
    }
    if (category) {
      filter.category = category;
    }

    if (startDate || endDate) {
      filter.date = {};
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }
    if (startDate) {
      filter.date.$gte = new Date(`${startDate}T00:00:00`);
    }
    if (endDate) {
      filter.date.$lte = new Date(`${endDate}T23:59:59.999`);
    }
    const totalTransaction = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalTransaction / itemPerPage);
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(itemPerPage);
    if (transactions.length === 0) {
      return res.status(200).json({
        success: true,
        message: "There are no transactions",
        transactions: [],
        totalPages: totalPages,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Your transactions list",
      transactions,
      totalPages: totalPages,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || " field to laod transactions" });
  }
};
////=======================getExpensiveCategories==================================

export const getExpensiveCategories = async (req, res) => {
  try {
    const categories = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//======================getMonthlyTransactionStats======================

export const getMonthlyTransactionStats = async (req, res) => {
  try {
    const now = new Date();
    const range = req.query.range || "6M";
    const timezone = "Asia/Karachi";

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    let startDate = null;

    if (range === "6M") {
      startDate = new Date(
        Date.UTC(currentYear, currentMonth - 6, 1) - 5 * 60 * 60 * 1000,
      );
    } else if (range === "1Y") {
      startDate = new Date(
        Date.UTC(currentYear, currentMonth - 12, 1) - 5 * 60 * 60 * 1000,
      );
    } else if (range !== "All") {
      return res.status(400).json({
        success: false,
        message: "Invalid range",
      });
    }

    const endDate = new Date(
      Date.UTC(currentYear, currentMonth, 1) - 5 * 60 * 60 * 1000,
    );

    const match = {
      user: new mongoose.Types.ObjectId(req.user.id),
      date: { $lt: endDate },
    };

    if (startDate) {
      match.date.$gte = startDate;
    }

    const monthlyTotals = await Transaction.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: {
            year: {
              $year: {
                date: "$date",
                timezone,
              },
            },
            month: {
              $month: {
                date: "$date",
                timezone,
              },
            },
            type: "$type",
          },
          total: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthlyData = [];

    if (range === "All") {
      const firstTransaction = await Transaction.findOne({
        user: req.user.id,
        date: { $lt: endDate },
      })
        .sort({ date: 1 })
        .select("date");

      if (firstTransaction) {
        const firstDate = firstTransaction.date;

        let year = firstDate.getUTCFullYear();
        let month = firstDate.getUTCMonth() + 1;

        while (
          year < currentYear ||
          (year === currentYear && month <= currentMonth)
        ) {
          const income = monthlyTotals.find(
            (item) =>
              item._id.year === year &&
              item._id.month === month &&
              item._id.type === "income",
          );

          const expense = monthlyTotals.find(
            (item) =>
              item._id.year === year &&
              item._id.month === month &&
              item._id.type === "expense",
          );

          monthlyData.push({
            year,
            month,
            income: income?.total || 0,
            expense: expense?.total || 0,
          });

          month++;

          if (month > 12) {
            month = 1;
            year++;
          }
        }
      }
    } else {
      const months = range === "1Y" ? 12 : 6;

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(Date.UTC(currentYear, currentMonth - 1 - i, 1));

        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;

        const income = monthlyTotals.find(
          (item) =>
            item._id.year === year &&
            item._id.month === month &&
            item._id.type === "income",
        );

        const expense = monthlyTotals.find(
          (item) =>
            item._id.year === year &&
            item._id.month === month &&
            item._id.type === "expense",
        );

        monthlyData.push({
          year,
          month,
          income: income?.total || 0,
          expense: expense?.total || 0,
        });
      }
    }

    const currentMonthData = monthlyData.find(
      (item) => item.year === currentYear && item.month === currentMonth,
    );

    return res.status(200).json({
      success: true,
      monthlyData,
      currentMonthExpense: currentMonthData?.expense || 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//=============================UpdateTransaction======================================

export const updateTransaction = async (req, res) => {
  try {
    const validation = transactionSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const { title, amount, type, category, description, date } =
      validation.data;

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        title,
        amount,
        type,
        category,
        description,
        date,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//=========================deleteTransaction========================
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!transaction) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction not found" });
    }
    return res
      .status(200)
      .json({ message: "Transaction successfully deleted", transaction });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
