import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class CommentRepository {
  async createComment(data: Prisma.commentCreateInput) {
    return prisma.comment.create({ select, data })
  }

  async getCommentById(id: number) {
    return prisma.comment.findUnique({ select, where: { id } })
  }

  async updateComment(id: number, data: Prisma.commentUpdateInput) {
    return prisma.comment.update({ select, where: { id }, data })
  }

  async deleteComment(id: number) {
    return prisma.comment.delete({ select, where: { id } })
  }
}

const select = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  threadId: true,
  thread: false,
  authorId: false,
  author: {
    select: {
      id: true,
      name: true,
      profilePicId: true,
    },
  },
} as const
