import { isUserAdmin } from "@/lib/utils/user.utils"
import type { CreateCommentInput, UpdateCommentInput } from "@/schemas/comment.schema"
import type { CommentService } from "@/services/comment.service"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly fastify: FastifyInstance,
  ) {}

  async create(request: FastifyRequest<{ Body: CreateCommentInput }>, reply: FastifyReply) {
    const comment = await this.commentService.create(request.body)

    this.fastify.io.to(`thread:${comment.threadId}`).emit("comment:create", comment)

    return reply.code(201).send(comment)
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const comment = await this.commentService.getById(+request.params.id)
    if (!comment) return reply.code(404).send({ message: "Not found" })

    return reply.send(comment)
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: UpdateCommentInput }>, reply: FastifyReply) {
    const comment = await this.commentService.getById(+request.params.id)
    if ((!comment || comment.author.id !== request.user.id) && !isUserAdmin(request.user)) {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const updated = await this.commentService.update(+request.params.id, request.body)

    this.fastify.io.to(`thread:${updated.threadId}`).emit("comment:update", updated)

    return reply.send(updated)
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const comment = await this.commentService.getById(+request.params.id)
    if ((!comment || comment.author.id !== request.user.id) && !isUserAdmin(request.user)) {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const deleted = await this.commentService.delete(+request.params.id)

    this.fastify.io.to(`thread:${deleted.threadId}`).emit("comment:delete", { id: +request.params.id })

    return reply.send({ success: true })
  }
}
