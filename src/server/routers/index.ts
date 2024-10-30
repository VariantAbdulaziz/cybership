import { createCallerFactory, mergeRouters, router } from "../trpc";
import { publicProcedure } from "../procedures/public-procedure";
import { auth } from "./auth";

export const healthCheck = router({
  healthCheck: publicProcedure.query(({ ctx }) => {
    return "server is healthy";
  }),
});

export const appRouter = mergeRouters(healthCheck, auth);

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
