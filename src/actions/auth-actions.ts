"use server";

import { ActionError, unauthenticatedAction } from "@/lib/safe-action";
import { LoginSchema } from "@/lib/validations/login-schema";
import { RegisterSchema } from "@/lib/validations/register-schema";
import { User } from "@/types";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export const registerAction = unauthenticatedAction
  .schema(RegisterSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      await api.post("/api/trpc/register", parsedInput);
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof AxiosError) {
        throw new ActionError(
          e.response?.data?.error?.message || "Unexpected error"
        );
      } else {
        throw new ActionError(`Unexpected error`);
      }
    }
    redirect("/login");
  });

export const loginAction = unauthenticatedAction
  .schema(LoginSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post("/api/trpc/login", parsedInput);
      return res.data["result"] as User;
    } catch (e) {
      console.error(e);
      return null;
    }
  });
