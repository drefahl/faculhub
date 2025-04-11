import type { CreateUserInput } from "@/schemas/user.schema"
import type { FastifyInstance } from "fastify"
import request from "supertest"

export async function createUser(app: FastifyInstance, userData: CreateUserInput) {
  const registerRes = await request(app.server).post("/api/users").send(userData)

  if (registerRes.status !== 201) {
    throw new Error("Error creating user")
  }

  return registerRes
}

export function getRandomUserData(): CreateUserInput {
  return {
    email: `user+${Date.now()}@example.com`,
    password: `P@ssW0rd-${Date.now()}`,
    name: `User ${Date.now()}`,
  }
}
