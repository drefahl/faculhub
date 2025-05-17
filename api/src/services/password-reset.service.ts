import crypto from "node:crypto"
import { env } from "@/config/env.config"
import { PasswordResetEmail } from "@/email/password-reset-email"
import { createHash, verifyHash } from "@/lib/utils/crypto.utils"
import type { PasswordResetRepository } from "@/repositories/password-reset.repository"
import type { EmailService } from "./email.service"
import type { UserService } from "./user.service"

export class PasswordResetService {
  constructor(
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async requestReset(email: string): Promise<string> {
    const user = await this.userService.getUserByEmail(email)
    if (!user) return ""

    const existing = await this.passwordResetRepository.findActiveByUserId(user.id)
    if (existing) return ""

    const rawToken = crypto.randomUUID()
    const tokenHash = createHash(rawToken)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    await this.passwordResetRepository.create(tokenHash, user.id, expiresAt)

    await this.emailService.sendMail({
      from: "no-reply@faculhub.com.br",
      to: user.email,
      subject: "Redefinição de senha",
      react: PasswordResetEmail({
        username: user.name ?? "",
        resetUrl: this.generateResetLink(tokenHash),
        expiresAt: expiresAt,
      }),
    })

    return rawToken
  }

  async resetPassword(rawToken: string, newPassword: string): Promise<boolean> {
    const tokenHash = createHash(rawToken)

    const record = await this.passwordResetRepository.findValidByHash(tokenHash)
    if (!record) return false

    if (!verifyHash(rawToken, record.token)) return false

    await this.userService.updatePassword(record.userId, newPassword)
    await this.passwordResetRepository.markUsed(record.id)

    return true
  }

  private generateResetLink(rawToken: string): string {
    return `${env.FRONTEND_URL}/reset-password?token=${rawToken}`
  }
}
