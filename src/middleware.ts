import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export default NextAuth(authConfig).auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isLoggedIn = !!req.auth;

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return Response.redirect(new URL("/admin/login", req.nextUrl));
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/admin/dashboard", req.nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/admin/:path*"],
};
