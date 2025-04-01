import { prisma } from "@/lib/prisma"
import type { user } from "@prisma/client"

export class UserRepository {
  async createUser(data: Omit<user, "id" | "created_at">): Promise<user> {
    return prisma.user.create({ data })
  }

  async getUserById(userId: number): Promise<user | null> {
    return prisma.user.findUnique({ where: { id: userId } })
  }

  async getUserByEmail(email: string): Promise<user | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async updateUser(userId: number, data: Partial<user>): Promise<user> {
    return prisma.user.update({ where: { id: userId }, data })
  }
}
