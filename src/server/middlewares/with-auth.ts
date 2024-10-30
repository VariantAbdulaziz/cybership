import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import { jwtVerify } from "jose";

const secretKey = process.env.SECRET_KEY;

interface TokenPayload {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

async function veryfyToken(token: string) {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(secretKey)
    );
    return verified.payload as any as TokenPayload;
  } catch (error) {
    console.error(error);
    throw new Error("Token not valid");
  }
}

export const withAuth = middleware(async ({ next, ctx }) => {
  const { req } = ctx;
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new TRPCError({ code: "UNAUTHORIZED" });

  const user = await veryfyToken(token);

  return next({
    ctx: {
      user,
    },
  });
});
