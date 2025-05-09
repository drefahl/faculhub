import type { LikeService } from "@/services/like.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  async likePost(request: FastifyRequest<{ Params: { postId: number } }>, reply: FastifyReply) {
    const { postId } = request.params
    const userId = request.user.id

    const like = await this.likeService.likePost(userId, postId)

    return reply.code(201).send(like)
  }

  async unlikePost(request: FastifyRequest<{ Params: { postId: number } }>, reply: FastifyReply) {
    const { postId } = request.params
    const userId = request.user.id

    await this.likeService.unlikePost(userId, postId)

    return reply.send({ success: true })
  }

  async countLikes(request: FastifyRequest<{ Params: { postId: number } }>, reply: FastifyReply) {
    const { postId } = request.params

    const count = await this.likeService.countLikes(postId)

    return reply.send({ count })
  }
}
