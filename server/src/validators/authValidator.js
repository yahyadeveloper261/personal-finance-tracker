import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(40, "Name cannot exceed 40 characters"),

  email: z.string().trim().toLowerCase().email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password cannot exceed 20 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});
