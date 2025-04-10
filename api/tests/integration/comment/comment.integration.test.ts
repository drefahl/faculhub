import { createServer } from "@/app"
import type { CreateCommentSchema } from "@/schemas/comment.schema"
import type { JWTPayload } from "@/types/fastify-jwt"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createUserAndGetAuthToken, getAuthToken } from "../utils/get-auth-token.util"

let app: FastifyInstance
let authToken: string
let payload: JWTPayload

describe("Comment Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
    const response = await getAuthToken(app)
    authToken = response.token
    payload = response.payload
  })

  afterAll(async () => {
    await app.close()
  })

  it("should create a new comment", async () => {
    const data: CreateCommentSchema = {
      content: "New comment test",
      threadId: 1,
      authorId: payload.id,
    }

    const response = await request(app.server)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send(data)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })

  it("should fail with invalid data", async () => {
    const response = await request(app.server).post("/api/comments").set("Authorization", `Bearer ${authToken}`).send({
      content: "",
      threadId: 1,
    })

    expect(response.status).toBe(400)
  })

  it("should return 403 if user is not the author", async () => {
    const data: CreateCommentSchema = {
      content: "Original Comment",
      threadId: 1,
      authorId: payload.id,
    }

    const createResponse = await request(app.server)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send(data)

    const commentId = createResponse.body.id

    const secondUserResponse = await createUserAndGetAuthToken(app, {
      email: `another-${new Date().getTime()}@email.com`,
      name: "Another User",
      password: "password123",
    })

    const secondUserToken = secondUserResponse.token

    const updateResponse = await request(app.server)
      .patch(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${secondUserToken}`)
      .send({ content: "Unauthorized Update" })

    expect(updateResponse.status).toBe(403)

    const deleteResponse = await request(app.server)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${secondUserToken}`)

    expect(deleteResponse.status).toBe(403)
  })
})
