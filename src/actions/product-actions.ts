"use server";

import { ProductSchema } from "@/lib/validations/product-schema";
import { ActionError, authenticatedAction } from "@/lib/authenticated-action";
import { TRPCClientError } from "@trpc/client";
import { revalidatePath } from "next/cache";

export const createProductAction = authenticatedAction
  .schema(ProductSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      await api.createProduct.mutate(parsedInput);
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
