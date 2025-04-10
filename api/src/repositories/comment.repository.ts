import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class CommentRepository {
  async createComment(data: Prisma.commentCreateInput) {
    return prisma.comment.create({ data })
  }

  async getCommentById(id: number) {
    return prisma.comment.findUnique({ where: { id } })
  }

  async updateComment(id: number, data: Prisma.commentUpdateInput) {
    return prisma.comment.update({ where: { id }, data })
  }

  async deleteComment(id: number) {
    return prisma.comment.delete({ where: { id } })
  }
}
