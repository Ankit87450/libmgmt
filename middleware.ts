import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";

// Edge middleware. Cannot touch `fs` / `readDb`, so we only check cookie
// *presence* here — deep role/validity checks happen in route handlers and
// in API endpoints. The client layout still bounces to /login if the
// session is missing or mismatched.
export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const protectedScope = pathname.startsWith("/admin") || pathname.startsWith("/user");
  if (protectedScope && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
