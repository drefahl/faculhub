import { createServer } from "@/app"
import type { CreateCommentInput } from "@/schemas/comment.schema"
import type { Session } from "@/types/fastify-jwt"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"
import { createUserAndGetAuthToken, getAuthTokenAsAdmin } from "./utils/auth.util"
import { constants } from "./utils/constants"
import { createThread } from "./utils/thread.util"

let app: FastifyInstance
let authToken: string
let payload: Session
let threadId: number

describe("Comment Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
    const response = await createUserAndGetAuthToken(app)
    authToken = response.token
    payload = response.payload
  })

  beforeEach(async () => {
    const threadResponse = await createThread(
      app,
      {
        title: "Integration Title",
        content: "Integration Content",
        authorId: payload.id,
      },
      authToken,
    )

    threadId = threadResponse.body.id
  })

  afterAll(async () => {
    await app.close()
  })

  it("should create a new comment", async () => {
    const data: CreateCommentInput = {
      content: "New comment test",
      threadId,
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
      threadId,
    })

    expect(response.status).toBe(400)
  })

  it("should return 403 if user is not the author", async () => {
    const data: CreateCommentInput = {
      content: "Original Comment",
      threadId,
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
      password: constants.user.password,
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

  it("should update a comment", async () => {
    const data: CreateCommentInput = { content: "Original Comment", threadId, authorId: payload.id }
    const createResponse = await request(app.server)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send(data)

    const commentId = createResponse.body.id

    const updateResponse = await request(app.server)
      .patch(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ content: "Updated Comment" })

    expect(updateResponse.status).toBe(200)
    expect(updateResponse.body.content).toBe("Updated Comment")
  })

  it("should delete a comment", async () => {
    const data: CreateCommentInput = { content: "Comment to delete", threadId, authorId: payload.id }
    const createResponse = await request(app.server)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send(data)

    const commentId = createResponse.body.id

    const deleteResponse = await request(app.server)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${authToken}`)

    expect(deleteResponse.status).toBe(200)
  })

  it("should allow admin to update another user's comment", async () => {
    const data: CreateCommentInput = { content: "Original Comment", threadId, authorId: payload.id }
    const createResponse = await request(app.server)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send(data)

    const commentId = createResponse.body.id

    const adminToken = (await getAuthTokenAsAdmin(app)).token

    const updateResponse = await request(app.server)
      .patch(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ content: "Admin Updated Comment" })

    expect(updateResponse.status).toBe(200)
    expect(updateResponse.body.content).toBe("Admin Updated Comment")
  })

  it("should fail to create a comment on a non-existent thread", async () => {
    const data: CreateCommentInput = { content: "Comment on invalid thread", threadId: 999, authorId: payload.id }
    const response = await request(app.server)
      .post("/api/comments")
      .set("Authorization", `Bearer ${authToken}`)
      .send(data)

    expect(response.status).toBe(404)
  })
})
