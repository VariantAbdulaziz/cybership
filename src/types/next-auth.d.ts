import { User } from "next-auth";
import { User as DBUser } from "@/types";
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: DBUser;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      email: string;
      firstName: string;
      lastName: string;
    };
    token: string;
  }

  interface User {
    email: string;
    firstName: string;
    lastName: string;
    token: string;
  }
}
