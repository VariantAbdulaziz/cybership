import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";
import { getSession } from "@/lib/session";
import { createServerClient } from "@/server/routers";

export class ActionError extends Error {}

export const unauthenticatedAction = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
  const api = await createServerClient({});
  return next({ ctx: { api } });
});

export const authenticatedAction = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
  const session = await getSession();
  if (!session) {
    throw new ActionError("User is not authenticated");
  }

  const { user, token } = session;
  const api = await createServerClient({ token });

  return next({ ctx: { user, api } });
});
