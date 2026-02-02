import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function redirectTo(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.searchParams.set("from", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Veřejné: auth endpointy a login stránky
  if (pathname.startsWith("/api/auth")) return NextResponse.next();
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) return NextResponse.next();
  if (pathname === "/login" || pathname.startsWith("/login/")) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Admin UI
  if (pathname.startsWith("/admin")) {
    if (!token || (token as any).userType !== "admin") return redirectTo(req, "/admin/login");
    return NextResponse.next();
  }

  // Client portal
  if (pathname.startsWith("/account")) {
    if (!token || (token as any).userType !== "client") return redirectTo(req, "/login");
    return NextResponse.next();
  }

  // API guard (optional layer; handlers musí guardovat i samy)
  if (pathname.startsWith("/api/admin")) {
    if (!token || (token as any).userType !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }
  if (pathname.startsWith("/api/client")) {
    if (!token || (token as any).userType !== "client") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/api/admin/:path*", "/api/client/:path*"]
};

