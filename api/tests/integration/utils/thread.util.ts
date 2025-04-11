import type { CreateThreadInput } from "@/schemas/thread.schema"
import type { FastifyInstance } from "fastify"
import request from "supertest"

export async function createThread(app: FastifyInstance, threadData: CreateThreadInput, authToken: string) {
  const response = await request(app.server)
    .post("/api/threads")
    .set("Authorization", `Bearer ${authToken}`)
    .send(threadData)

  if (response.status !== 201) throw new Error("Error creating thread")

  return response
}
