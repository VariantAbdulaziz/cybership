import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { createCallerFactory, mergeRouters, router } from "../trpc";
import { publicProcedure } from "../procedures/public-procedure";
import { authRouter } from "./auth-router";
import { productRouter } from "./product-router";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

export const healthCheckRouter = router({
  healthCheck: publicProcedure.query(({ ctx }) => {
    return "server is healthy";
  }),
});

export const appRouter = mergeRouters(
  healthCheckRouter,
  authRouter,
  productRouter
);

export const createCaller = createCallerFactory(appRouter);

export const createServerClient = async ({ token }: { token?: string }) => {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${API_BASE_URL}/api/trpc`,
        headers: {
          ...(token
            ? {
                authorization: `Bearer ${token}`,
                ContentType: "application / json",
              }
            : {}),
        },
      }),
    ],
  });
};

export type AppRouter = typeof appRouter;
