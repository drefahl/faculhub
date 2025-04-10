import { CommentRepository } from "@/repositories/comment.repository"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createCommentRepositoryMock(): CommentRepository {
  const repo = new CommentRepository()

  vi.spyOn(repo, "createComment").mockImplementation(async (data) => {
    return {
      id: mockConstants.comment.id,
      content: data.content,
      authorId: data?.author?.connect?.id ?? mockConstants.comment.authorId,
      threadId: data?.thread?.connect?.id ?? mockConstants.comment.threadId,
      createdAt: new Date(),
    }
  })

  vi.spyOn(repo, "getCommentById").mockImplementation(async (id) => {
    if (id !== mockConstants.comment.id) return null

    return {
      id: mockConstants.comment.id,
      threadId: mockConstants.comment.threadId,
      content: mockConstants.comment.content,
      authorId: mockConstants.comment.authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(repo, "updateComment").mockImplementation(async (id, data) => {
    if (id !== mockConstants.comment.id) throw new Error("Comment not found")

    return {
      id: mockConstants.comment.id,
      threadId: mockConstants.comment.threadId,
      authorId: mockConstants.comment.authorId,
      content: typeof data?.content === "string" ? data.content : mockConstants.comment.content,
      createdAt: new Date(),
    }
  })

  vi.spyOn(repo, "deleteComment").mockImplementation(async (id) => {
    if (id !== mockConstants.comment.id) throw new Error("Comment not found")

    return {
      id: mockConstants.comment.id,
      threadId: mockConstants.comment.threadId,
      authorId: mockConstants.comment.authorId,
      content: mockConstants.comment.content,
      createdAt: new Date(),
    }
  })

  return repo
}
