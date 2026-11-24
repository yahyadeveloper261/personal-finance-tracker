import Budget from "../models/Budget.js";
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
    const now = new Date();

    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = 5;
    const skip = (page - 1) * limit;

    const filter = {
      user: req.user.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };

    const [budget, totalBudgets] = await Promise.all([
      Budget.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Budget.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      budget,
      totalBudgets,
      currentPage: page,
      totalPages: Math.ceil(totalBudgets / limit),
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
