import Budget from "../models/Budget.js";
import mongoose from "mongoose";
export const createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    const budget = await Budget.create({
      user: req.user.id,
      category,
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
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getBudget = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const currenPage = Number(page) || 1;
    const itemPerPage = Number(limit) || 5;
    const skip = (currenPage - 1) * itemPerPage;

    const now = new Date();

    const filter = {
      user: req.user.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
    const totalBudgets = await Budget.countDocuments(filter);
    const totalPages = Math.ceil(totalBudgets / itemPerPage);
    const budget = await Budget.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(itemPerPage);

    const totalBudgetAmount = await Budget.aggregate([
      {
        $match: {
          ...filter,
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
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
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

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

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        category,
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

    res.status(200).json({
      success: true,
      message: "Budget updated successfully!",
      budget,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update budget",
    });
  }
};
