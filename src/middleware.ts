import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const authResult = await verifySession(sessionCookie?.value);
  const isAuthenticated = authResult.valid;

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
      const res = NextResponse.redirect(loginUrl);
      if (sessionCookie) {
        res.cookies.set(SESSION_COOKIE_NAME, "", {
          path: "/",
          maxAge: 0,
          expires: new Date(0),
          httpOnly: true,
          sameSite: "lax"
        });
      }
      return res;
    }
  }

  // 3. If already authenticated and trying to access /admin/login, redirect to /admin/pipeline
  if (pathname === "/admin/login" && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect") || "/admin/pipeline";
    return NextResponse.redirect(new URL(redirectParam, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
