import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: "USER" | "PREMIUM";
  phone: string;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
