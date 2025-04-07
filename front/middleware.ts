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
  const publicRoute = PUBLIC_ROUTES.find((route) => route.pathname === pathname)
  const authToken = request.cookies.get("authToken")?.value

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
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/forum/novo",
    "/perfil",
    "/configuracoes",
    "/materiais/novo",
    "/caronas/novo",
    "/grupos/novo",
    "/moradia/novo",
  ],
}
