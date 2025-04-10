import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { extractAuthTokenFromHeaders } from "../utils/get-auth-token.util"

let app: FastifyInstance

const { email, password } = { email: "admin@example.com", password: "admin123" }

describe("Login API Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
  })

  afterAll(async () => {
    await app.close()
  })

  describe("POST /api/login", () => {
    it("should login with valid credentials and return a valid token", async () => {
      const response = await request(app.server).post("/api/login").send({ email, password })

      expect(response.status).toBe(200)
      expect(response.headers["set-cookie"]).toBeDefined()
      expect(response.headers["set-cookie"][0]).toContain("authToken")
    })

    it("should throw an error with invalid credentials", async () => {
      const response = await request(app.server).post("/api/login").send({ email, password: "invalid-password" })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Invalid credentials")
    })

    it("should refresh the token", async () => {
      const loginResponse = await request(app.server).post("/api/login").send({ email, password })
      const token = extractAuthTokenFromHeaders(loginResponse.headers)

      const refreshResponse = await request(app.server).get("/api/refresh").set("Authorization", `Bearer ${token}`)

      expect(refreshResponse.status).toBe(200)
      expect(refreshResponse.headers["set-cookie"]).toBeDefined()
      expect(refreshResponse.headers["set-cookie"][0]).toContain("authToken")
      expect(refreshResponse.body.message).toBe("Authenticated successfully")
    })
  })
})
