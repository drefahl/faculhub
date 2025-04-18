import { isUserAdmin } from "@/lib/utils/user.utls"
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

    return reply.code(201).send(comment)
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const comment = await this.commentService.getById(+request.params.id)
    if (!comment) return reply.code(404).send({ message: "Not found" })

    return reply.send(comment)
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: UpdateCommentInput }>, reply: FastifyReply) {
    const comment = await this.commentService.getById(+request.params.id)
    if ((!comment || comment.authorId !== request.user.id) && !isUserAdmin(request.user)) {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const updated = await this.commentService.update(+request.params.id, request.body)

    return reply.send(updated)
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const comment = await this.commentService.getById(+request.params.id)
    if ((!comment || comment.authorId !== request.user.id) && !isUserAdmin(request.user)) {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    await this.commentService.delete(+request.params.id)

    return reply.send({ success: true })
  }
}
