import type { ThreadService } from "@/services/thread.service"
import { beforeEach, describe, expect, it } from "vitest"
import { ZodError } from "zod"
import { mockConstants } from "./mocks/constants"
import { createMockServices } from "./mocks/factories"

const {
  user: { id: authorId },
} = mockConstants

describe("Thread Unit Tests", () => {
  let threadService: ThreadService

  beforeEach(() => {
    threadService = createMockServices().threadService
  })

  it("should create a thread with valid data", async () => {
    const thread = await threadService.create({
      title: "Hello",
      content: "World",
      authorId,
    })

    expect(thread).toHaveProperty("id")
  })

  it("should fail with invalid data", async () => {
    await expect(threadService.create({ title: "", content: "", authorId })).rejects.toThrow(ZodError)
  })

  it("should return null if thread not found", async () => {
    const notFound = await threadService.getById(0)

    expect(notFound).toBeNull()
  })

  it("should update a thread with valid data", async () => {
    const thread = await threadService.create({
      title: "Original Title",
      content: "Original Content",
      authorId,
    })

    const updatedThread = await threadService.update(thread.id, {
      title: "Updated Title",
      content: "Updated Content",
    })

    expect(updatedThread).toHaveProperty("id", thread.id)
    expect(updatedThread.title).toBe("Updated Title")
    expect(updatedThread.content).toBe("Updated Content")
  })

  it("should delete a thread", async () => {
    const thread = await threadService.create({
      title: "Thread to delete",
      content: "Content",
      authorId,
    })

    const deletedThread = await threadService.delete(thread.id)

    expect(deletedThread).toHaveProperty("id", thread.id)
    const notFound = await threadService.getById(thread.id)
    expect(notFound).toBeNull()
  })

  it("should throw an error when creating a thread with non-existent author", async () => {
    await expect(
      threadService.create({
        title: "Valid Title",
        content: "Valid Content",
        authorId: 999,
      }),
    ).rejects.toThrow("Author not found")
  })
})
