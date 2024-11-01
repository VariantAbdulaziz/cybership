"use server";

import { CustomerSchema } from "@/lib/validations/customer-schema";
import { ActionError, authenticatedAction } from "@/lib/authenticated-action";
import { TRPCClientError } from "@trpc/client";
import { revalidatePath } from "next/cache";

export const createCustomerAction = authenticatedAction
  .schema(CustomerSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      await api.createCustomer.mutate(parsedInput);
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
