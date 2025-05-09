import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = [
  { pathname: "/", whenAuthenticated: "next" },
  { pathname: "/login", whenAuthenticated: "redirect" },
  { pathname: "/register", whenAuthenticated: "redirect" },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get("authToken")?.value

  if (pathname === "/login" || pathname === "/register") {
    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    const referer = request.headers.get("referer") ?? "/"

    const response = NextResponse.next()
    if (referer.includes("/login") || referer.includes("/register")) return response

    response.cookies.set("redirectTo", referer, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return response
  }

  const publicRoute = PUBLIC_ROUTES.find((route) => route.pathname === pathname)

  if (!authToken && publicRoute) {
    return NextResponse.next()
  }

  if (!authToken && !publicRoute) {
    return NextResponse.redirect(new URL(REDIRECT_WHEN_NOT_AUTHENTICATED, request.url))
  }

  if (authToken && publicRoute && publicRoute.whenAuthenticated === "redirect") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/login", "/register", "/forum/new", "/perfil"],
}
