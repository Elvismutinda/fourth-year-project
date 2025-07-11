import NextAuth from "next-auth";

import authConfig from "../auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "../routes";
// import { NextRequest, NextResponse } from "next/server";
// import { decryptKey } from "./lib/utils";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  return null;
});

// export function middleware(req: NextRequest) {
//   const url = req.nextUrl;
//   const isAdminRoute = url.pathname.startsWith("/admin");

//   if (isAdminRoute) {
//     const encryptedKey = req.cookies.get("accessKey")?.value;
//     const decryptedKey = encryptedKey ? decryptKey(encryptedKey) : null;

//     const adminPasskey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY;

//     if (!decryptedKey || decryptedKey !== adminPasskey) {
//       return NextResponse.redirect(new URL("/login?admin=true", req.url));
//     }
//   }

//   return NextResponse.next();
// }

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
