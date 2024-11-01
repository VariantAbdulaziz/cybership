"use server";

import {
  ActionError,
  unauthenticatedAction,
} from "@/lib/unauthenticated-action";
import { LoginSchema } from "@/lib/validations/login-schema";
import { RegisterSchema } from "@/lib/validations/register-schema";
import { User } from "@/types";
import { TRPCClientError } from "@trpc/client";
import { redirect } from "next/navigation";

export const registerAction = unauthenticatedAction
  .schema(RegisterSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      await api.register.mutate(parsedInput);
    } catch (e) {
      console.error(e);
      if (e instanceof TRPCClientError) {
        throw new ActionError(e.message || "Unexpected error");
      } else {
        throw new ActionError("Unexpected error");
      }
    }
    redirect("/login");
  });

export const loginAction = unauthenticatedAction
  .schema(LoginSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const user = await api.login.mutate(parsedInput);
      return user as User;
    } catch (e) {
      console.error(e);
      if (e instanceof TRPCClientError) {
        throw new ActionError(e.message || "Unexpected error");
      } else {
        throw new ActionError("Unexpected error");
      }
    }
  });
