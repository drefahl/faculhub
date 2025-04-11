import { NotFoundError } from "@/errors/NotFoundError"
import type { CommentService } from "@/services/comment.service"
import { beforeEach, describe, expect, it } from "vitest"
import { ZodError } from "zod"
import { mockConstants } from "./mocks/constants"
import { createMockServices } from "./mocks/factories"

const {
  thread: { id: threadId },
  user: { id: authorId },
} = mockConstants

describe("Comment Unit Tests", () => {
  let commentService: CommentService

  beforeEach(() => {
    commentService = createMockServices().commentService
  })

  it("should create a comment with valid data", async () => {
    const comment = await commentService.create({
      threadId,
      authorId,
      content: "Test",
    })

    expect(comment).toHaveProperty("id")
  })

  it("should fail with invalid data", async () => {
    await expect(
      commentService.create({
        threadId,
        authorId,
        content: "",
      }),
    ).rejects.toThrow(ZodError)
  })

  it("should return null if comment not found", async () => {
    const notFound = await commentService.getById(0)

    expect(notFound).toBeNull()
  })

  it("should update a comment with valid data", async () => {
    const comment = await commentService.create({
      threadId,
      authorId,
      content: "Original Comment",
    })

    const updatedComment = await commentService.update(comment.id, {
      content: "Updated Comment",
    })

    expect(updatedComment).toHaveProperty("id", comment.id)
    expect(updatedComment.content).toBe("Updated Comment")
  })

  it("should delete a comment", async () => {
    const comment = await commentService.create({
      threadId,
      authorId,
      content: "Comment to delete",
    })

    const deletedComment = await commentService.delete(comment.id)

    expect(deletedComment).toHaveProperty("id", comment.id)

    const notFound = await commentService.getById(comment.id)

    expect(notFound).toBeNull()
  })

  it("should throw an error when creating a comment on a non-existent thread", async () => {
    await expect(
      commentService.create({
        threadId: 999,
        authorId,
        content: "Test",
      }),
    ).rejects.toThrow(NotFoundError)
  })
})
