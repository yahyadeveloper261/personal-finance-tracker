import mongoose from "mongoose";
import Budget from "../models/Budget.js";
import { budgetSchema } from "../validators/financeSchema.js";

// ================= CREATE BUDGET =================

export const createBudget = async (req, res) => {
  try {
    const validation = budgetSchema.safeParse(req.body);

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

    const { category, amount, month, year } = validation.data;

    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category: category.trim(),
      month,
      year,
    });

    if (existingBudget) {
      return res.status(409).json({
        success: false,
        message: "Budget already exists for this category and month",
      });
    }

    const budget = await Budget.create({
      user: req.user.id,
      category: category.trim(),
      amount,
      month,
      year,
    });

    return res.status(201).json({
      success: true,
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Budget already exists for this category and month",
      });
    }

    console.error("Create Budget Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= GET BUDGET =================

export const getBudget = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const itemPerPage = Math.max(Number(limit) || 5, 1);
    const skip = (currentPage - 1) * itemPerPage;

    const now = new Date();

    const filter = {
      user: new mongoose.Types.ObjectId(req.user.id),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };

    const totalBudgets = await Budget.countDocuments(filter);
    const totalPages = Math.ceil(totalBudgets / itemPerPage);

    const budget = await Budget.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemPerPage);

    const totalBudgetAmount = await Budget.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalBudget = totalBudgetAmount[0]?.total || 0;

    return res.status(200).json({
      success: true,
      budget,
      totalBudgets,
      totalBudget,
      totalPages,
    });
  } catch (error) {
    console.error("Get Budget Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= DELETE BUDGET =================

export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete Budget Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE BUDGET =================

export const updateBudget = async (req, res) => {
  try {
    const validation = budgetSchema.safeParse(req.body);

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

    const { category, amount, month, year } = validation.data;

    const existingBudget = await Budget.findOne({
      user: req.user.id,
      category: category.trim(),
      month,
      year,
      _id: { $ne: req.params.id },
    });

    if (existingBudget) {
      return res.status(409).json({
        success: false,
        message: "Another budget already exists for this category and month",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        category: category.trim(),
        amount,
        month,
        year,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Budget updated successfully!",
      budget,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Budget already exists for this category and month",
      });
    }

    console.error("Update Budget Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
