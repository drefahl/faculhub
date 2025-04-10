import type { CommentRepository } from "@/repositories/comment.repository"
import {
  type CreateCommentSchema,
  type UpdateCommentSchema,
  createCommentSchema,
  updateCommentSchema,
} from "@/schemas/comment.schema"

export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async create(data: CreateCommentSchema) {
    createCommentSchema.parse(data)

    const { authorId, threadId, ...commentData } = data

    return this.commentRepository.createComment({
      ...commentData,
      author: { connect: { id: authorId } },
      thread: { connect: { id: threadId } },
    })
  }

  async getById(id: number) {
    return this.commentRepository.getCommentById(id)
  }

  async update(id: number, data: UpdateCommentSchema) {
    updateCommentSchema.parse(data)

    const comment = await this.commentRepository.getCommentById(id)
    if (!comment) throw new Error("Comment not found")

    return this.commentRepository.updateComment(id, data)
  }

  async delete(id: number) {
    const comment = await this.commentRepository.getCommentById(id)
    if (!comment) throw new Error("Comment not found")

    return this.commentRepository.deleteComment(id)
  }
}
