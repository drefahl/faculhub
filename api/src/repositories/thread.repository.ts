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
    const where: Prisma.threadWhereInput = {
      title: { contains: search, mode: "insensitive" },
    }

    const [total, threads] = await prisma.$transaction([
      prisma.thread.count({ where }),
      prisma.thread.findMany({ select, take, skip, where }),
    ])

    const page = Math.floor(skip / take) + 1
    const totalPages = Math.ceil(total / take)

    return {
      data: threads,
      total,
      page,
      perPage: take,
      totalPages,
    }
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
