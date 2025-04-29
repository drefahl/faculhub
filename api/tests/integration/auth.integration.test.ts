import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import { createUser, getRandomUserData } from "./utils/user.util"

let app: FastifyInstance

const { email, password, name } = getRandomUserData()

describe("Login API Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
  })

  beforeEach(async () => {
    await createUser(app, { email, password, name })
  })

  afterAll(async () => {
    await app.close()
  })

  describe("POST /api/login", () => {
    it("should login with valid credentials and return a valid token", async () => {
      const response = await request(app.server).post("/api/login").send({ email, password })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
      expect(response.body.token).toBeDefined()
    })

    it("should throw an error with invalid credentials", async () => {
      const response = await request(app.server).post("/api/login").send({ email, password: "Wr0ngP@ssword" })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Invalid credentials")
    })

    it("should refresh the token", async () => {
      const loginResponse = await request(app.server).post("/api/login").send({ email, password })
      const token = loginResponse.body.token

      const refreshResponse = await request(app.server).get("/api/refresh").set("Authorization", `Bearer ${token}`)

      expect(refreshResponse.status).toBe(200)
      expect(refreshResponse.body).toHaveProperty("token")
      expect(refreshResponse.body.token).toBeDefined()
    })
  })

  it("should fail to refresh with an invalid token", async () => {
    const invalidToken = "invalid.token.here"
    const response = await request(app.server).get("/api/refresh").set("Authorization", `Bearer ${invalidToken}`)

    expect(response.status).toBe(401)
  })

  it("should fail to login with non-existent email", async () => {
    const response = await request(app.server)
      .post("/api/login")
      .send({ email: "nonexistent@example.com", password: "R@nd0wPassWord" })

    expect(response.status).toBe(401)
    expect(response.body.message).toBe("Invalid credentials")
  })
})
