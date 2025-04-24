import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: "USER" | "PREMIUM";
  phone: string;
  paystackSubscriptionStart: Date;
  paystackSubscriptionEnd: Date;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
