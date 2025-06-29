import { env } from "@/config/env.config"
import { SignJWT, decodeJwt, jwtVerify } from "jose"
import z from "zod"

const secret = new TextEncoder().encode(env.JWT_SECRET)

export const tokenSchema = z
  .object({
    id: z.number().int().positive(),
    email: z.string().email({ message: "Invalid email" }),
    name: z.string().nullable(),
    picture: z.string().nullable(),
    role: z.enum(["USER", "ADMIN"]),
    providers: z.array(z.enum(["google", "credentials"])),
    exp: z.number().int().positive().optional(),
  })
  .strict()

export type TokenPayload = z.infer<typeof tokenSchema>

export async function createToken(payload: TokenPayload) {
  const jwt = await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1d").sign(secret)

  return jwt
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret)

  return payload as TokenPayload
}

export function decodeToken(token: string) {
  return decodeJwt(token) as TokenPayload
}
