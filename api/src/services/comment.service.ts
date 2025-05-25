import { NotFoundError } from "@/errors/NotFoundError"
import type { CommentRepository } from "@/repositories/comment.repository"
import type { ThreadRepository } from "@/repositories/thread.repository"
import {
  type CreateCommentInput,
  type UpdateCommentInput,
  createCommentSchema,
  updateCommentSchema,
} from "@/schemas/comment.schema"

export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly threadRepository: ThreadRepository,
  ) {}

  async create(data: CreateCommentInput) {
    createCommentSchema.parse(data)

    const { authorId, threadId, ...commentData } = data

    const thread = await this.threadRepository.getThreadById(threadId)
    if (!thread) throw new NotFoundError("Thread not found")

    this.threadRepository.updateThread(threadId, { lastInteraction: new Date() })

    return this.commentRepository.createComment({
      ...commentData,
      author: { connect: { id: authorId } },
      thread: { connect: { id: threadId } },
    })
  }

  async getById(id: number) {
    return this.commentRepository.getCommentById(id)
  }

  async update(id: number, data: UpdateCommentInput) {
    updateCommentSchema.parse(data)

    const comment = await this.commentRepository.getCommentById(id)
    if (!comment) throw new NotFoundError("Comment not found")

    return this.commentRepository.updateComment(id, data)
  }

  async delete(id: number) {
    const comment = await this.commentRepository.getCommentById(id)
    if (!comment) throw new NotFoundError("Comment not found")

    return this.commentRepository.deleteComment(id)
  }
}
