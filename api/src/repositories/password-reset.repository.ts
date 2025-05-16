import { prisma } from "@/lib/prisma"
import type { passwordReset } from "@prisma/client"

export class PasswordResetRepository {
  async create(token: string, userId: number, expiresAt: Date): Promise<passwordReset> {
    return prisma.passwordReset.create({
      data: { token, userId, expiresAt },
    })
  }

  async findValidByHash(hash: string): Promise<passwordReset | null> {
    return prisma.passwordReset.findFirst({
      where: {
        token: hash,
        used: false,
        expiresAt: { gt: new Date() },
      },
    })
  }

  async markUsed(id: string): Promise<void> {
    await prisma.passwordReset.update({
      where: { id },
      data: { used: true },
    })
  }
}
