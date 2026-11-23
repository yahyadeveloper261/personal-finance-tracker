import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const transactions = await Transaction.find({ user: req.user.id });

    const totalIncome = transactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const totalExpense = transactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const totalBalance = totalIncome - totalExpense;

    return res.status(200).json({
      success: true,
      message: `Welcome Back ${user.name}`,
      user,
      totalIncome,
      totalExpense,
      totalBalance,
    });
  } catch (error) {
    console.log("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
