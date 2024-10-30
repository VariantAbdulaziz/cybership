import { type inferAsyncReturnType } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts: FetchCreateContextFnOptions) {
  const db = new PrismaClient();
  const { req } = opts;
  return { req, db };
}

export type Context = inferAsyncReturnType<typeof createContext>;
