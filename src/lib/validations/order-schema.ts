import { z } from "zod";

export const OrderSchema = z.object({
  fulfillmentStatus: z.enum(["DELIVERED", "PENDING", "CANCELED"]),
  customerId: z.number(),
  productId: z.number(),
});

export const OrderFilterSchema = z.object({
  minOrderDate: z.string().optional(),
  maxOrderDate: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});
