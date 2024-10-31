import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";
import axios from "axios";
import { getSession } from "@/lib/session";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000/";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

export class ActionError extends Error {}

export const unauthenticatedAction = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
}).use(async ({ next }) => {
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

  api.interceptors.request.use(
    async (config: any) => {
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return next({ ctx: { user, api } });
});
