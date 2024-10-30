import { initTRPC } from "@trpc/server";
import { createContext } from "./context";

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;
export const mergeRouters = t.mergeRouters;

export const router = t.router;
export const procedure = t.procedure;
