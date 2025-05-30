import type { CreateUserInput } from "@/schemas/user.schema"
import type { FastifyInstance } from "fastify"
import request from "supertest"

export async function getAuthToken(app: FastifyInstance, credentials: CreateUserInput): Promise<string> {
  const regRes = await request(app.server).post("/users").send(credentials)
  if (regRes.status !== 201) {
    throw new Error(`Failed to register user: ${regRes.status} ${JSON.stringify(regRes.body)}`)
  }

  const loginRes = await request(app.server).post("/login").send(credentials)

  if (loginRes.status !== 200 || !loginRes.body.token) {
    throw new Error(`Login failed: ${loginRes.status} ${JSON.stringify(loginRes.body, null, 2)}`)
  }

  return loginRes.body.token as string
}
