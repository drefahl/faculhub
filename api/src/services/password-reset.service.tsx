import crypto from "node:crypto"
import { env } from "@/config/env.config"
import { PasswordResetEmail } from "@/email/emails/password-reset-email"
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

    const rawToken = crypto.randomUUID()
    const token = crypto.createHash("sha256").update(rawToken).digest("hex")
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60)

    await this.passwordResetRepository.create(token, user.id, expiresAt)

    await this.emailService.sendMail({
      from: "cauadrefahl@gmail.com",
      to: "bimovideo@gmail.com",
      subject: "Redefinição de senha",
      react: (
        <PasswordResetEmail username={user.name!} resetUrl={this.generateResetLink(rawToken)} expiresAt={expiresAt} />
      ),
    })

    return token
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
    const record = await this.passwordResetRepository.findValidByHash(tokenHash)
    if (!record) return false

    await this.userService.updatePassword(record.userId, newPassword)
    await this.passwordResetRepository.markUsed(record.id)

    return true
  }

  private generateResetLink(rawToken: string): string {
    return `${env.FRONTEND_URL}/reset-password?token=${rawToken}`
  }
}
