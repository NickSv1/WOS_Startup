import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "knodle_demo_access";

export function middleware(request: NextRequest) {
  const hasAccess = request.cookies.get(ACCESS_COOKIE)?.value === "1";
  if (hasAccess) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("try", "live");
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/app", "/app/:path*"],
};
