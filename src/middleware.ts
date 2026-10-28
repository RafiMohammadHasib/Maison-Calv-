import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("mc_admin_session");
  const isAuthenticated = sessionCookie?.value === "mc_session_authorized_2026";

  // 1. Redirections for legacy or alternate admin paths
  if (pathname === "/admin/crm" || pathname === "/admin/leads") {
    return NextResponse.redirect(new URL("/admin/pipeline", request.url));
  }
  if (pathname === "/admin/dashboard") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // 2. Protect all /admin/* routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. If already authenticated and trying to access /admin/login, redirect to /admin
  if (pathname === "/admin/login" && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect") || "/admin";
    return NextResponse.redirect(new URL(redirectParam, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
