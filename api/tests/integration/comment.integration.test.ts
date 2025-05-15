import { NotFoundError } from "@/errors/NotFoundError"
import { createCommentService } from "@/factories/serviceFactory"
import { prisma } from "@/lib/prisma"
import type { CommentService } from "@/services/comment.service"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"

describe("CommentService Integration", () => {
  let commentService: CommentService
  let threadId: number
  let authorId: number

  beforeEach(async () => {
    await resetDatabase()

    const user = await prisma.user.create({ data: { name: "User", email: "u@u.com", password: "123456" } })
    authorId = user.id
    const thread = await prisma.thread.create({
      data: { title: "Thread", content: "Content", author: { connect: { id: authorId } } },
    })
    threadId = thread.id

    commentService = createCommentService()
  })

  it("creates a comment successfully", async () => {
    const comment = await commentService.create({ threadId, authorId, content: "Hello" })

    expect(comment.id).toBeDefined()
    expect(comment.content).toBe("Hello")
  })

  it("throws when thread does not exist", async () => {
    await expect(commentService.create({ threadId: 999, authorId, content: "Test" })).rejects.toBeInstanceOf(
      NotFoundError,
    )
  })

  it("returns null if comment not found", async () => {
    expect(await commentService.getById(0)).toBeNull()
  })

  it("updates a comment and throws if not found", async () => {
    const c = await commentService.create({ threadId, authorId, content: "Orig" })
    const updated = await commentService.update(c.id, { content: "Upd" })

    expect(updated.content).toBe("Upd")
    await expect(commentService.update(0, { content: "X" })).rejects.toBeInstanceOf(NotFoundError)
  })

  it("deletes a comment and throws if not found", async () => {
    const c = await commentService.create({ threadId, authorId, content: "ToDel" })
    const deleted = await commentService.delete(c.id)

    expect(deleted.id).toBe(c.id)

    await expect(commentService.getById(c.id)).resolves.toBeNull()
    await expect(commentService.delete(0)).rejects.toBeInstanceOf(NotFoundError)
  })
})
