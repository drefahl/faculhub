import { APP_CONSTANTS } from "@/constants"
import type { CreateUserInput } from "@/schemas/user.schema"
import type { JWTPayload } from "@/types/fastify-jwt"
import type { FastifyInstance } from "fastify"
import { decodeJwt } from "jose"
import request from "supertest"

export async function getAuthToken(app: FastifyInstance) {
  const loginRes = await request(app.server).post("/api/login").send({
    email: APP_CONSTANTS.DEFAULT_USER.email,
    password: APP_CONSTANTS.DEFAULT_USER.password,
  })

  if (loginRes.status !== 200) throw new Error("Error logging in user")

  const token = extractAuthTokenFromHeaders(loginRes.headers)

  return {
    token,
    payload: decodeJwt(token) as JWTPayload,
  }
}

export async function createUserAndGetAuthToken(app: FastifyInstance, userData: CreateUserInput) {
  const registerRes = await request(app.server).post("/api/users").send(userData)
  if (registerRes.status !== 201) throw new Error("Error registering user")

  const loginRes = await request(app.server).post("/api/login").send(userData)
  if (loginRes.status !== 200) throw new Error("Error logging in user")
  const token = extractAuthTokenFromHeaders(loginRes.headers)

  return {
    token,
    payload: decodeJwt(token) as JWTPayload,
  }
}

export function extractAuthTokenFromHeaders(headers: Record<string, string>): string {
  const tokenHeader = Object.values(headers).find(
    (header) => Array.isArray(header) && header[0].startsWith("authToken="),
  )

  if (!tokenHeader) throw new Error("Token not found in headers")

  const token = tokenHeader[0].split(";")[0].split("=")[1]
  if (!token) throw new Error("Token not found in headers")

  return token
}
