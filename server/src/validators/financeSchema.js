import { z } from "zod";

export const transactionSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  amount: z.coerce.number().finite().positive("Amount must be greater than 0"),
  type: z.enum(["income", "expense"], {
    error: "Type must be income or expense",
  }),
  category: z.string().trim().min(1, "Category is required").max(50),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  date: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.date().optional(),
  ),
});

export const budgetSchema = z.object({
  category: z.string().trim().min(1, "Category is required").max(50),
  amount: z.coerce.number().finite().positive("Amount must be greater than 0"),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1900).max(9999),
});
