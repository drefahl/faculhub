import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class LikeRepository {
  async createLike(data: Prisma.likeCreateInput) {
    return prisma.like.create({ data })
  }

  async deleteLike(userId: number, postId: number) {
    return prisma.like.deleteMany({
      where: { userId, postId },
    })
  }

  async getLike(userId: number, postId: number) {
    return prisma.like.findFirst({
      where: { userId, postId },
    })
  }

  async countLikes(postId: number) {
    return prisma.like.count({
      where: { postId },
    })
  }
}
