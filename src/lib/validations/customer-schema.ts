import { z } from "zod";

export const CustomerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

export const CustomerFilterSchema = z.object({
  query: z.string().optional(),
  page: z.number().int().default(1),
  limit: z.number().int().default(10),
});
