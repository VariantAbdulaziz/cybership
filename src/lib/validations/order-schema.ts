import { z } from "zod";

export const OrderSchema = z.object({
  fulfillmentStatus: z.enum(["delivered", "pending", "cancelled"]),
  customerId: z.number().int(),
  productId: z.number().int(),
});
