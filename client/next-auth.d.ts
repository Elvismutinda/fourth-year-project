import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: "USER" | "PREMIUM";
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
