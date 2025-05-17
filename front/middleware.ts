import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

type PublicRoute =
  | { pathname: string; whenAuthenticated: "next" }
  | { pathname: string; whenAuthenticated: "redirect"; redirectTo: string }

const PUBLIC_ROUTES: Readonly<PublicRoute[]> = [
  { pathname: "/", whenAuthenticated: "next" },
  { pathname: "/login", whenAuthenticated: "redirect", redirectTo: "/" },
  { pathname: "/register", whenAuthenticated: "redirect", redirectTo: "/" },
  { pathname: "/reset-password", whenAuthenticated: "redirect", redirectTo: "/" },
  { pathname: "/forgot-password", whenAuthenticated: "redirect", redirectTo: "/" },
] as const

const ROUTES_NOT_SAVE_COOKIE_REDIRECT = ["/login", "/register", "/reset-password", "/forgot-password"]
const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get("authToken")?.value

  const response = NextResponse.next()

  if (pathname === "/login" || pathname === "/register") {
    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    const referer = request.headers.get("referer") ?? "/"

    if (!ROUTES_NOT_SAVE_COOKIE_REDIRECT.some((route) => referer.includes(route))) {
      response.cookies.set("redirectTo", referer, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    }
  }

  const publicRoute = PUBLIC_ROUTES.find((route) => route.pathname === pathname)

  if (!authToken && publicRoute) {
    return response
  }

  if (!authToken && !publicRoute) {
    return NextResponse.redirect(new URL(REDIRECT_WHEN_NOT_AUTHENTICATED, request.url))
  }

  if (authToken && publicRoute?.whenAuthenticated === "redirect") {
    return NextResponse.redirect(new URL(publicRoute.redirectTo, request.url))
  }

  return response
}

export const config = {
  matcher: ["/login", "/register", "/forum/new", "/perfil", "/reset-password", "/forgot-password"],
}
