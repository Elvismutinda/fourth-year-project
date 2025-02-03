import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import { db } from "@/lib/db";
import authConfig from "./auth.config";
import { getUserById } from "@/data/user";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      // console.log({ user, account });
      if (account?.provider === "credentials") {
        // check if email is verified
        const existingUser = await getUserById(user.id);

        if (!existingUser || !existingUser[0].emailVerified) return false;
      }

      return true;
    },
    async session({ token, session }) {
      // console.log({ sessionToken: token });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "PREMIUM";
      }

      return session;
    },
    async jwt({ token }) {
      //   console.log({ token });
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser[0].role;

      return token;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
