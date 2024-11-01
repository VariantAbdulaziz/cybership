"use server";

import { OrderSchema } from "@/lib/validations/order-schema";
import { ActionError, authenticatedAction } from "@/lib/authenticated-action";
import { TRPCClientError } from "@trpc/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createOrderAction = authenticatedAction
  .schema(OrderSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      await api.createOrder.mutate(parsedInput);
    } catch (e) {
      console.error(e);
      if (e instanceof TRPCClientError) {
        throw new ActionError(e.message || "Unexpected error");
      } else {
        throw new ActionError("Unexpected error");
      }
    }
    revalidatePath("/");
  });

export const updateOrderAction = authenticatedAction
  .schema(OrderSchema.extend({ id: z.number() }))
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      await api.updateOrder.mutate(parsedInput);
    } catch (e) {
      console.error(e);
      if (e instanceof TRPCClientError) {
        throw new ActionError(e.message || "Unexpected error");
      } else {
        throw new ActionError("Unexpected error");
      }
    }
    revalidatePath("/");
  });

export const deleteOrderAction = authenticatedAction
  .schema(z.object({ id: z.number() }))
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      await api.deleteOrder.mutate(parsedInput);
    } catch (e) {
      console.error(e);
      if (e instanceof TRPCClientError) {
        throw new ActionError(e.message || "Unexpected error");
      } else {
        throw new ActionError("Unexpected error");
      }
    }
    revalidatePath("/");
  });
