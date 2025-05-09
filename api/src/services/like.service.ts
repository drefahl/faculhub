import { NotFoundError } from "@/errors/NotFoundError"
import type { LikeRepository } from "@/repositories/like.repository"

export class LikeService {
  constructor(private readonly likeRepo: LikeRepository) {}

  async likePost(userId: number, postId: number) {
    const exists = await this.likeRepo.getLike(userId, postId)
    if (exists) {
      throw new Error("Post already liked")
    }

    return this.likeRepo.createLike({
      user: { connect: { id: userId } },
      post: { connect: { id: postId } },
    })
  }

  async unlikePost(userId: number, postId: number) {
    const exists = await this.likeRepo.getLike(userId, postId)
    if (!exists) {
      throw new NotFoundError("Like not found")
    }

    return await this.likeRepo.deleteLike(userId, postId)
  }

  async countLikes(postId: number) {
    const count = await this.likeRepo.countLikes(postId)

    return { count }
  }

  async verifyLike(userId: number, postId: number) {
    const exists = await this.likeRepo.getLike(userId, postId)
    return !!exists
  }
}
