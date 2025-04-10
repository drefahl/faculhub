import type { ThreadService } from "@/services/thread.service"
import { beforeEach, describe, expect, it } from "vitest"
import { ZodError } from "zod"
import { mockConstants } from "../mocks/constants"
import { createMockServices } from "../mocks/factories"

describe("Thread Unit Tests", () => {
  let threadService: ThreadService

  beforeEach(() => {
    threadService = createMockServices().threadService
  })

  it("should create a thread with valid data", async () => {
    const thread = await threadService.create({
      title: "Hello",
      content: "World",
      authorId: mockConstants.user.id,
    })

    expect(thread).toHaveProperty("id")
  })

  it("should fail with invalid data", async () => {
    await expect(threadService.create({ title: "", content: "", authorId: mockConstants.user.id })).rejects.toThrow(
      ZodError,
    )
  })

  it("should return null if thread not found", async () => {
    const notFound = await threadService.getById(0)
    expect(notFound).toBeNull()
  })
})
