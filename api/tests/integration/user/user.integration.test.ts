import path from "node:path"
import { createServer } from "@/app"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

let app: FastifyInstance
let authToken: string
let createdUserId: string

describe("User Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    const uniqueEmail = `testuser+${Date.now()}@example.com`

    const registerResponse = await request(app.server).post("/api/users").send({
      email: uniqueEmail,
      name: "Test User",
      password: "Test@123",
    })

    createdUserId = registerResponse.body.id

    const loginResponse = await request(app.server)
      .post("/api/login")
      .send({ email: uniqueEmail, password: "Test@123" })

    authToken = loginResponse.headers["set-cookie"][0].split(";")[0].split("=")[1]
  })

  it("should register a new user", async () => {
    const uniqueEmail = `anotheruser+${Date.now()}@example.com`

    const response = await request(app.server).post("/api/users").send({
      email: uniqueEmail,
      name: "Another User",
      password: "Another@123",
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })

  it("should fail to register a user with an invalid email", async () => {
    const response = await request(app.server).post("/api/users").send({
      email: "invalid-email",
      name: "Invalid User",
      password: "pass",
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toContain("Invalid request data")
  })

  it("should login the user", async () => {
    expect(authToken).toBeDefined()
  })

  it("should get the logged user profile", async () => {
    const response = await request(app.server).get("/api/users/me").set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id", createdUserId)
  })

  it("should update the logged user profile", async () => {
    const newName = "Updated User"
    const response = await request(app.server)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ name: newName })

    expect(response.status).toBe(200)
    expect(response.body.name).toEqual(newName)
  })

  it("should change the user picture when a new one is provided", async () => {
    const filePath = path.resolve(__dirname, "../../fixtures/test-image.png")

    const response = await request(app.server)
      .put("/api/users/profile-image")
      .set("Authorization", `Bearer ${authToken}`)
      .attach("file", filePath)

    console.log(response.body)

    expect(response.status).toBe(200)
    expect(response.body.picture).toMatch(/uploads\/.+\.png/) // TODO:
  })
})
