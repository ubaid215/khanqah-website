import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: UserRole;
    avatar?: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      avatar?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
