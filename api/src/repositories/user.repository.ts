import { prisma } from "@/lib/prisma"
import type { Prisma, user } from "@prisma/client"

export class UserRepository {
  async createUser(data: Prisma.userCreateInput): Promise<user> {
    return prisma.user.create({ data })
  }

  async getUserById(userId: number): Promise<user | null> {
    return prisma.user.findUnique({ where: { id: userId } })
  }

  async getUserByEmail(email: string): Promise<user | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async updateUser(userId: number, data: Prisma.userUpdateInput): Promise<user> {
    return prisma.user.update({ where: { id: userId }, data })
  }
}
