import { env } from "@/config/env.config"
import type { CookieSerializeOptions } from "@fastify/cookie"

export const createCookieOptions = (overrides?: Partial<CookieSerializeOptions>): CookieSerializeOptions => ({
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  sameSite: "lax",
  ...overrides,
})
