"use server";

import { unauthenticatedAction } from "@/lib/safe-action";
import { LoginSchema } from "@/lib/validations/login-schema";
import { RegisterSchema } from "@/lib/validations/register-schema";
import { User } from "@/types";

export const registerAction = unauthenticatedAction
  .schema(RegisterSchema)
  .action(async ({ ctx, parsedInput }) => {
    const { api } = ctx;
    try {
      const res = await api.post("/api/trpc/register", parsedInput);
      return res.data["result"] as User;
    } catch (e) {
      console.error(e);
      return null;
    }
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
