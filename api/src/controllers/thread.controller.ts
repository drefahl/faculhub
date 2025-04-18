import { isUserAdmin } from "@/lib/utils/user.utls"
import type { ThreadService } from "@/services/thread.service"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import type { CreateThreadInput, UpdateThreadInput } from "../schemas/thread.schema"

export class ThreadController {
  constructor(
    private readonly threadService: ThreadService,
    private readonly fastify: FastifyInstance,
  ) {}

  async create(request: FastifyRequest<{ Body: Exclude<CreateThreadInput, "authorId"> }>, reply: FastifyReply) {
    const thread = await this.threadService.create({
      ...request.body,
      authorId: request.user.id,
    })

    this.fastify.io.to("thread:all").emit("thread:create", thread)

    return reply.code(201).send(thread)
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const thread = await this.threadService.getById(+request.params.id)
    if (!thread) return reply.code(404).send({ message: "Not found" })

    return reply.send(thread)
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: UpdateThreadInput }>, reply: FastifyReply) {
    const threadId = +request.params.id

    const thread = await this.threadService.getById(threadId)
    if ((!thread || thread.author.id !== request.user.id) && !isUserAdmin(request.user)) {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const updated = await this.threadService.update(threadId, request.body)

    this.fastify.io.to(`thread:${threadId}`).emit("thread:update", updated)

    return reply.send(updated)
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const threadId = +request.params.id

    const thread = await this.threadService.getById(threadId)
    if ((!thread || thread.author.id !== request.user.id) && !isUserAdmin(request.user)) {
      return reply.code(403).send({ message: "Unauthorized" })
    }

    const deleted = await this.threadService.delete(threadId)

    this.fastify.io.to("thread:all").emit("thread:delete", { id: threadId })
    this.fastify.io.to(`thread:${threadId}`).emit("thread:delete", { id: threadId })

    return reply.send(deleted)
  }

  async list(
    request: FastifyRequest<{ Querystring: { page: number; take: number; search?: string } }>,
    reply: FastifyReply,
  ) {
    const threads = await this.threadService.list(request.query)

    return reply.send(threads)
  }
}
