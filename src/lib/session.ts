import "server-only";

import * as React from "react";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export const getSession = React.cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  return { user: session.user, token: session.token };
});
