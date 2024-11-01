"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      className={"flex items-center text-red-500 mx-3"}
      onClick={() => {
        signOut({
          callbackUrl: "/login",
        });
      }}
    >
      <LogOut className={"text-red-400 border-0"} size={24} />
    </button>
  );
}
