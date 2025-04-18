import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class ThreadRepository {
  async createThread(data: Prisma.threadCreateInput) {
    return prisma.thread.create({ data, select })
  }

  async getThreadById(id: number) {
    return prisma.thread.findUnique({ select, where: { id } })
  }

  async updateThread(id: number, data: Prisma.threadUpdateInput) {
    return prisma.thread.update({ select, where: { id }, data })
  }

  async deleteThread(id: number) {
    return prisma.thread.delete({ select, where: { id } })
  }

  async listThreads({ take, skip, search }: { take: number; skip: number; search?: string }) {
    return prisma.thread.findMany({
      select,
      take,
      skip,
      where: {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
    })
  }
}

const select = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  authorId: false,
  author: {
    select: {
      id: true,
      name: true,
      profilePicId: true,
    },
  },
  comments: {
    select: {
      id: true,
      content: true,
      threadId: false,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          profilePicId: true,
        },
      },
    },
  },
} as const
