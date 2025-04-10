import type { ThreadService } from "@/services/thread.service"
import type { FastifyReply, FastifyRequest } from "fastify"
import type { CreateThreadSchema, UpdateThreadSchema } from "../schemas/thread.schema"

export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  async create(request: FastifyRequest<{ Body: CreateThreadSchema }>, reply: FastifyReply) {
    const thread = await this.threadService.create(request.body)

    return reply.code(201).send(thread)
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const thread = await this.threadService.getById(+request.params.id)
    if (!thread) return reply.code(404).send({ message: "Not found" })

    return reply.send(thread)
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: UpdateThreadSchema }>, reply: FastifyReply) {
    const thread = await this.threadService.getById(+request.params.id)
    if (!thread || thread.authorId !== request.user.id) {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const updated = await this.threadService.update(+request.params.id, request.body)

    return reply.send(updated)
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const thread = await this.threadService.getById(+request.params.id)
    if (!thread || thread.authorId !== request.user.id) {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const deleted = await this.threadService.delete(+request.params.id)

    return reply.send(deleted)
  }
}
