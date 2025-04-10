import { createServer } from "@/app"
import type { CreateThreadSchema } from "@/schemas/thread.schema"
import type { JWTPayload } from "@/types/fastify-jwt"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createUserAndGetAuthToken, getAuthToken } from "../utils/get-auth-token.util"

let app: FastifyInstance
let authToken: string
let payload: JWTPayload

const createThread = async (data: CreateThreadSchema) => {
  return request(app.server).post("/api/threads").set("Authorization", `Bearer ${authToken}`).send(data)
}

const getThread = async (threadId: string) => {
  return request(app.server).get(`/api/threads/${threadId}`).set("Authorization", `Bearer ${authToken}`)
}

const updateThread = async (threadId: string, updateData: Partial<CreateThreadSchema>) => {
  return request(app.server)
    .patch(`/api/threads/${threadId}`)
    .set("Authorization", `Bearer ${authToken}`)
    .send(updateData)
}

const deleteThread = async (threadId: string) => {
  return request(app.server).delete(`/api/threads/${threadId}`).set("Authorization", `Bearer ${authToken}`)
}

describe("Thread Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
    const response = await getAuthToken(app)
    authToken = response.token
    payload = response.payload
  })

  afterAll(async () => {
    await app.close()
  })

  it("should create a new thread", async () => {
    const data: CreateThreadSchema = {
      title: "Integration Title",
      content: "Integration Content",
      authorId: payload.id,
    }

    const response = await createThread(data)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })

  it("should get a thread by id", async () => {
    const data: CreateThreadSchema = {
      title: "Integration Title",
      content: "Integration Content",
      authorId: payload.id,
    }

    const createResponse = await createThread(data)
    const threadId = createResponse.body.id

    const getResponse = await getThread(threadId)

    expect(getResponse.status).toBe(200)
    expect(getResponse.body).toHaveProperty("id", threadId)
  })

  it("should update a thread", async () => {
    const data: CreateThreadSchema = {
      title: "Integration Title",
      content: "Integration Content",
      authorId: payload.id,
    }

    const createResponse = await createThread(data)
    const threadId = createResponse.body.id

    const updateResponse = await updateThread(threadId, {
      title: "Updated Title",
      content: "Updated Content",
    })

    expect(updateResponse.status).toBe(200)
    expect(updateResponse.body).toHaveProperty("title", "Updated Title")
    expect(updateResponse.body).toHaveProperty("content", "Updated Content")
  })

  it("should delete a thread", async () => {
    const data: CreateThreadSchema = {
      title: "Integration Title",
      content: "Integration Content",
      authorId: payload.id,
    }

    const createResponse = await createThread(data)
    const threadId = createResponse.body.id

    const deleteResponse = await deleteThread(threadId)

    expect(deleteResponse.status).toBe(200)
    expect(deleteResponse.body).toHaveProperty("id", threadId)
  })

  it("should return 403 if user is not the author", async () => {
    const data = {
      title: "Thread Title",
      content: "Thread Content",
      authorId: payload.id,
    }

    const createResponse = await createThread(data)
    const threadId = createResponse.body.id

    const secondUserResponse = await createUserAndGetAuthToken(app, {
      email: `another-${new Date().getTime()}@email.com`,
      name: "Another User",
      password: "password123",
    })

    const secondUserToken = secondUserResponse.token

    const updateResponse = await request(app.server)
      .patch(`/api/threads/${threadId}`)
      .set("Authorization", `Bearer ${secondUserToken}`)
      .send({ title: "Unauthorized Update" })

    expect(updateResponse.status).toBe(403)

    const deleteResponse = await request(app.server)
      .delete(`/api/threads/${threadId}`)
      .set("Authorization", `Bearer ${secondUserToken}`)

    expect(deleteResponse.status).toBe(403)
  })
})
