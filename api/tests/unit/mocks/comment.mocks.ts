import { NotFoundError } from "@/errors/NotFoundError"
import { CommentRepository } from "@/repositories/comment.repository"
import type { comment } from "@prisma/client"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createCommentRepositoryMock(): CommentRepository {
  const repo = new CommentRepository()

  const comments: Map<number, comment> = new Map([
    [
      mockConstants.comment.id,
      {
        id: mockConstants.comment.id,
        threadId: mockConstants.thread.id,
        authorId: mockConstants.user.id,
        content: mockConstants.comment.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  ])

  vi.spyOn(repo, "createComment").mockImplementation(async (data) => {
    const threadId = data?.thread?.connect?.id ?? mockConstants.thread.id
    const authorId = data?.author?.connect?.id ?? mockConstants.user.id

    const id = Math.floor(Math.random() * 1000)
    const newComment: comment = {
      id,
      threadId,
      authorId,
      content: data.content,
      createdAt: new Date(),
    }
    comments.set(id, newComment)
    return newComment
  })

  vi.spyOn(repo, "getCommentById").mockImplementation(async (id) => {
    return comments.get(id) ?? null
  })

  vi.spyOn(repo, "updateComment").mockImplementation(async (id, data) => {
    const existingComment = comments.get(id)
    if (!existingComment) throw new NotFoundError("Comment not found")

    const updatedComment: comment = {
      ...existingComment,
      content: typeof data?.content === "string" ? data.content : existingComment.content,
    }
    comments.set(id, updatedComment)
    return updatedComment
  })

  vi.spyOn(repo, "deleteComment").mockImplementation(async (id) => {
    const comment = comments.get(id)
    if (!comment) throw new NotFoundError("Comment not found")

    comments.delete(id)
    return comment
  })

  vi.spyOn(repo, "listComments").mockImplementation(async (threadId, { take, skip }) => {
    const threadComments = Array.from(comments.values()).filter((comment) => comment.threadId === threadId)
    const paginatedComments = threadComments.slice(skip, skip + take).map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      author: {
        id: comment.authorId,
        name: mockConstants.user.name,
        profilePicId: mockConstants.user.profilePicId,
      },
    }))

    return paginatedComments
  })

  return repo
}
