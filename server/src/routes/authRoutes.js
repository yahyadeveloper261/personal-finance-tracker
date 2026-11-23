import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validates.js";
import {
  register,
  login,
  refreshUserAccessToken,
} from "../controllers/authController.js";
import { getDashboard } from "../controllers/dashboardController.js";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getExpensiveCategories,
} from "../controllers/transactionController.js";

import {
  createBudget,
  getBudget,
  deleteBudget,
  updateBudget,
} from "../controllers/budgetController.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import {
  getProfile,
  uploadImage,
  updateProfile,
} from "../controllers/userController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", refreshUserAccessToken);

router.get("/my/transactions", authMiddleware, getTransactions);
router.get("/expense/categories", authMiddleware, getExpensiveCategories);
router.post("/create/transaction", authMiddleware, createTransaction);
router.put("/transaction/:id", authMiddleware, updateTransaction);
router.delete("/transaction/:id", authMiddleware, deleteTransaction);

router.get("/my/budgets", authMiddleware, getBudget);
router.post("/create/budgets", authMiddleware, createBudget);
router.delete("/budget/:id", authMiddleware, deleteBudget);
router.put("/budget/:id", authMiddleware, updateBudget);

router.get("/my/profile", authMiddleware, getProfile);
router.put(
  "/updateProfile",
  authMiddleware,
  upload.single("image"),
  uploadImage,
);
router.put("/updateName", authMiddleware, updateProfile);

export default router;
