import path from "node:path"
import { createServer } from "@/app"
import type { JWTPayload } from "@/types/fastify-jwt"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { getAuthToken } from "../utils/get-auth-token.util"

let app: FastifyInstance
let authToken: string
let payload: JWTPayload

describe("User Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
    const response = await getAuthToken(app)
    authToken = response.token
    payload = response.payload
  })

  afterAll(async () => {
    await app.close()
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
    expect(response.body).toHaveProperty("id", payload.id)
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

    expect(response.status).toBe(200)
  })

  it("should delete the user profile image", async () => {
    const filePath = path.resolve(__dirname, "../../fixtures/test-image.png")

    await request(app.server)
      .put("/api/users/profile-image")
      .set("Authorization", `Bearer ${authToken}`)
      .attach("file", filePath)

    const response = await request(app.server)
      .delete("/api/users/profile-image")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
  })
})
