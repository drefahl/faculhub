import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class ThreadRepository {
  async createThread(data: Prisma.threadCreateInput) {
    return prisma.thread.create({ data })
  }

  async getThreadById(id: number) {
    return prisma.thread.findUnique({ where: { id } })
  }

  async updateThread(id: number, data: Prisma.threadUpdateInput) {
    return prisma.thread.update({ where: { id }, data })
  }

  async deleteThread(id: number) {
    return prisma.thread.delete({ where: { id } })
  }
}
