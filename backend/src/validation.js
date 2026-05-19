import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name must have at least 2 characters"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  category: z.string().trim().min(2, "Category is required"),
  type: z.string().trim().optional().default(""),
  size: z.string().trim().optional().default(""),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative").default(0),
  imageUrl: z.string().trim().url("Image URL must be valid").or(z.literal("")).optional().default("")
});

export const cartItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive()
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(8)
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"])
});
