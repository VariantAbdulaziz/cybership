import { NextRequest } from "next/server";

import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

interface RouteHandlerContext {
  params: { nextauth: string[] };
}

async function handler(req: NextRequest, context: RouteHandlerContext) {
  return await NextAuth(req, context, authOptions);
}

export { handler as GET, handler as POST };
