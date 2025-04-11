import type { CreateUserInput } from "@/schemas/user.schema"
import type { Session } from "@/types/fastify-jwt"
import type { FastifyInstance } from "fastify"
import { decodeJwt } from "jose"
import request from "supertest"
import { constants } from "./constants"
import { createUser, getRandomUserData } from "./user.util"

export async function getAuthToken(app: FastifyInstance) {
  const { email, password } = getRandomUserData()

  const loginRes = await request(app.server).post("/api/login").send({ email, password })
  if (loginRes.status !== 200) throw new Error("Error logging in user")

  const token = extractAuthTokenFromHeaders(loginRes.headers)

  return {
    token,
    payload: decodeJwt(token) as Session,
  }
}

export async function createUserAndGetAuthToken(app: FastifyInstance, userData: CreateUserInput = getRandomUserData()) {
  await createUser(app, userData)

  const loginRes = await request(app.server).post("/api/login").send(userData)
  if (loginRes.status !== 200) throw new Error("Error logging in user")

  const token = extractAuthTokenFromHeaders(loginRes.headers)

  return {
    token,
    payload: decodeJwt(token) as Session,
  }
}

export async function getAuthTokenAsAdmin(app: FastifyInstance) {
  const loginRes = await request(app.server)
    .post("/api/login")
    .send({ email: constants.admin.email, password: constants.admin.password })

  if (loginRes.status !== 200) throw new Error("Error logging in user as admin")
  const token = extractAuthTokenFromHeaders(loginRes.headers)

  return {
    token,
    payload: decodeJwt(token) as Session,
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
