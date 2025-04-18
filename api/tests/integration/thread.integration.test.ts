import { createServer } from "@/app"
import { threadResponseArraySchema } from "@/routes/thread.route"
import type { CreateThreadInput } from "@/schemas/thread.schema"
import type { Session } from "@/types/fastify-jwt"
import type { FastifyInstance } from "fastify"
import request from "supertest"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createUserAndGetAuthToken, getAuthTokenAsAdmin } from "./utils/auth.util"
import { constants } from "./utils/constants"

let app: FastifyInstance
let authToken: string
let payload: Session

const createThread = async (data: CreateThreadInput) => {
  return request(app.server).post("/api/threads").set("Authorization", `Bearer ${authToken}`).send(data)
}

const getThread = async (threadId: number) => {
  return request(app.server).get(`/api/threads/${threadId}`).set("Authorization", `Bearer ${authToken}`)
}

const updateThread = async (threadId: number, updateData: Partial<CreateThreadInput>) => {
  return request(app.server)
    .patch(`/api/threads/${threadId}`)
    .set("Authorization", `Bearer ${authToken}`)
    .send(updateData)
}

const deleteThread = async (threadId: number) => {
  return request(app.server).delete(`/api/threads/${threadId}`).set("Authorization", `Bearer ${authToken}`)
}

describe("Thread Integration Tests", () => {
  beforeAll(async () => {
    app = await createServer()
    const response = await createUserAndGetAuthToken(app)
    authToken = response.token
    payload = response.payload
  })

  afterAll(async () => {
    await app.close()
  })

  it("should create a new thread", async () => {
    const data: CreateThreadInput = {
      title: "Integration Title",
      content: "Integration Content",
      authorId: payload.id,
    }

    const response = await createThread(data)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })

  it("should get a thread by id", async () => {
    const data: CreateThreadInput = {
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
    const data: CreateThreadInput = {
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
    const data: CreateThreadInput = {
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
      password: constants.user.password,
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

  it("should be possible to update another user's thread as an ADMIN", async () => {
    const data = {
      title: "Thread Title",
      content: "Thread Content",
      authorId: payload.id,
    }

    const createResponse = await createThread(data)
    const threadId = createResponse.body.id

    const adminUserToken = (await getAuthTokenAsAdmin(app)).token

    const updateResponse = await request(app.server)
      .patch(`/api/threads/${threadId}`)
      .set("Authorization", `Bearer ${adminUserToken}`)
      .send({ title: "Admin Update" })

    expect(updateResponse.status).toBe(200)
    expect(updateResponse.body).toHaveProperty("title", "Admin Update")
  })

  it("should fail to create a thread with empty title", async () => {
    const data: CreateThreadInput = { title: "", content: "Valid Content", authorId: payload.id }
    const response = await createThread(data)

    expect(response.status).toBe(400)
  })

  it("should return 404 for a non-existent thread", async () => {
    const response = await getThread(0)

    expect(response.status).toBe(404)
  })

  it("should partially update a thread", async () => {
    const data: CreateThreadInput = { title: "Original Title", content: "Original Content", authorId: payload.id }
    const createResponse = await createThread(data)
    const threadId = createResponse.body.id

    const updateResponse = await updateThread(threadId, { title: "Updated Title" })

    expect(updateResponse.status).toBe(200)
    expect(updateResponse.body.title).toBe("Updated Title")
    expect(updateResponse.body.content).toBe("Original Content")
  })

  it("should list threads with pagination", async () => {
    const data: CreateThreadInput = { title: "Title", content: "Content", authorId: payload.id }

    await createThread(data)
    await createThread(data)
    await createThread(data)

    const response = await request(app.server)
      .get("/api/threads?page=1&take=2")
      .set("Authorization", `Bearer ${authToken}`)

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(2)
    expect(threadResponseArraySchema.safeParse(response.body).success).toBe(true)
  })
})
