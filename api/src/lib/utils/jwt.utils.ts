import { env } from "@/config/env.config"
import { SignJWT, decodeJwt, jwtVerify } from "jose"
import z from "zod"

const secret = new TextEncoder().encode(env.JWT_SECRET)

export const tokenSchema = z
  .object({
    id: z.number(),
    email: z.string().email(),
    name: z.string().nullable(),
    picture: z.string().nullable(),
    providers: z.array(z.enum(["google", "credentials"])),
    exp: z.number().optional(),
  })
  .strict()

export type TokenPayload = z.infer<typeof tokenSchema>

export async function createToken(payload: TokenPayload) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(env.NODE_ENV === "development" ? "1h" : "1d")
    .sign(secret)

  return jwt
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)

  return payload as TokenPayload
}

export function decodeToken(token: string) {
  return decodeJwt(token) as TokenPayload
}
