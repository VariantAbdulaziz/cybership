import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  details: z.string().min(1, "Details are required"),
  image: z.string().optional(),
});
