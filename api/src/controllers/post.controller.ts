import type { CreatePostInput, UpdatePostInput } from "@/schemas/post.schema"
import type { PostService } from "@/services/post.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class PostController {
  constructor(private readonly postService: PostService) {}

  async create(request: FastifyRequest<{ Body: Omit<CreatePostInput, "authorId"> }>, reply: FastifyReply) {
    const data = { ...request.body, authorId: request.user.id }
    const post = await this.postService.create(data)

    return reply.code(201).send(post)
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const post = await this.postService.getById(request.params.id, request.user?.id)

    return reply.send(post)
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: UpdatePostInput }>, reply: FastifyReply) {
    const post = await this.postService.update(request.params.id, request.body)

    return reply.send(post)
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const post = await this.postService.delete(request.params.id)

    return reply.send(post)
  }

  async list(
    request: FastifyRequest<{
      Querystring: { page: number; take: number; search?: string; course?: number; type?: "EVENT" | "NEWS" }
    }>,
    reply: FastifyReply,
  ) {
    const { take, page, search, course, type } = request.query
    const posts = await this.postService.list({ take, page, search, course, type, userId: request.user?.id })

    return reply.send(posts)
  }

  async recordView(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const post = await this.postService.recordView(request.params.id, request.user?.id)

    return reply.send(post)
  }
}
