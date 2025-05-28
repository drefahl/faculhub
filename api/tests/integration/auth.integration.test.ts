import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { resetDatabase } from "tests/helpers/reset-db"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

let app: FastifyInstance

describe("Login API Integration Tests", () => {
  const userData = {
    email: `user+${Date.now()}@example.com`,
    password: `P@ssW0rd-${Date.now()}`,
    name: `User ${Date.now()}`,
  } as const

  beforeAll(async () => {
    await resetDatabase()

    app = await createServer()
  })

  beforeEach(async () => {
    const registerRes = await request(app.server).post("/users").send(userData)

    if (registerRes.status !== 201) {
      throw new Error("Error creating user")
    }
  })

  afterAll(async () => {
    await app.close()
  })

  describe("POST /login", () => {
    it("should login with valid credentials and return a valid token", async () => {
      const response = await request(app.server)
        .post("/login")
        .send({ email: userData.email, password: userData.password })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
      expect(response.body.token).toBeDefined()
    })
  })
})
