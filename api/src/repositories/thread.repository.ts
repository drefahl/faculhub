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
    await prisma.comment.deleteMany({ where: { threadId: id } })
    return prisma.thread.delete({ select, where: { id } })
  }

  async listThreads({
    take,
    skip,
    search,
    categoryId,
    orderBy = {},
  }: { take: number; skip: number; search?: string; categoryId?: number; orderBy?: object }) {
    const where: Prisma.threadWhereInput = {
      title: { contains: search, mode: "insensitive" },
      categories: categoryId ? { some: { id: categoryId } } : undefined,
    }

    const [total, threads] = await prisma.$transaction([
      prisma.thread.count({ where }),
      prisma.thread.findMany({ select, take, skip, where, orderBy }),
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

const select: Prisma.threadSelect = {
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
  categories: {
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const
