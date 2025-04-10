import type { CommentService } from "@/services/comment.service"
import { beforeEach, describe, expect, it } from "vitest"
import { ZodError } from "zod"
import { mockConstants } from "../mocks/constants"
import { createMockServices } from "../mocks/factories"

describe("Comment Unit Tests", () => {
  let commentService: CommentService

  beforeEach(() => {
    commentService = createMockServices().commentService
  })

  it("should create a comment with valid data", async () => {
    const comment = await commentService.create({
      threadId: mockConstants.thread.id,
      authorId: mockConstants.user.id,
      content: "Test",
    })

    expect(comment).toHaveProperty("id")
  })

  it("should fail with invalid data", async () => {
    await expect(
      commentService.create({
        threadId: mockConstants.thread.id,
        authorId: mockConstants.user.id,
        content: "",
      }),
    ).rejects.toThrow(ZodError)
  })

  it("should return null if comment not found", async () => {
    const notFound = await commentService.getById(0)
    expect(notFound).toBeNull()
  })
})
