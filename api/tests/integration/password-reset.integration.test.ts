import { createUserService } from "@/factories/serviceFactory"
import { prisma } from "@/lib/prisma"
import { comparePassword } from "@/lib/utils/crypto.utils"
import { PasswordResetRepository } from "@/repositories/password-reset.repository"
import type { EmailService } from "@/services/email.service"
import { PasswordResetService } from "@/services/password-reset.service"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("Password Reset Service Unit Tests", () => {
  let service: PasswordResetService
  let mockEmailService: EmailService

  beforeEach(async () => {
    await resetDatabase()

    await prisma.user.create({ data: { email: "user@example.com", password: "RanD0wP4ssword!", name: "Test User" } })

    mockEmailService = {
      sendMail: vi.fn().mockResolvedValue(undefined),
    } as unknown as EmailService

    service = new PasswordResetService(new PasswordResetRepository(), createUserService(), mockEmailService)
  })

  it("should generate a token and store hashed record", async () => {
    const hashedToken = await service.requestReset("user@example.com")

    expect(hashedToken).toBeTypeOf("string")

    const record = await prisma.passwordReset.findFirst({
      where: { token: hashedToken },
    })

    expect(record).not.toBeNull()
    expect(record!.used).toBe(false)
    expect(record!.expiresAt.getTime()).toBeGreaterThan(Date.now())
    expect(mockEmailService.sendMail).toHaveBeenCalledOnce()
  })

  it("should reset password with valid token", async () => {
    const hashedToken = await service.requestReset("user@example.com")
    const result = await service.resetPassword(hashedToken, "NewP4ssword!")

    expect(result).toBe(true)

    const user = await prisma.user.findFirst({ where: { email: "user@example.com" } })
    const isPasswordValid = await comparePassword("NewP4ssword!", user!.password)

    expect(isPasswordValid).toBe(true)

    const record = await prisma.passwordReset.findFirst({ where: { token: hashedToken } })

    expect(record).not.toBeNull()
    expect(record!.used).toBe(true)
  })

  it("should not reset with invalid token", async () => {
    const result = await service.resetPassword("bad-token", "pass")

    expect(result).toBe(false)
  })
})
