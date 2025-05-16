import { PasswordResetRepository } from "@/repositories/password-reset.repository"
import type { passwordReset } from "@prisma/client"
import { vi } from "vitest"

export function createPasswordResetRepositoryMock(): PasswordResetRepository {
  const repo = new PasswordResetRepository()

  const likes: Map<string, passwordReset> = new Map([])

  vi.spyOn(repo, "create").mockImplementation(async (token, userId, expiresAt) => {
    const id = crypto.randomUUID()
    const newToken: passwordReset = { id, token, userId, createdAt: new Date(), expiresAt, used: false }
    likes.set(token, newToken)

    return newToken
  })

  vi.spyOn(repo, "findValidByHash").mockImplementation(async (hash) => {
    console.log(likes)

    const token = likes.get(hash)
    if (!token) return null
    if (token.used || token.expiresAt < new Date()) return null

    return token
  })

  vi.spyOn(repo, "markUsed").mockImplementation(async (id) => {
    const token = Array.from(likes.values()).find((t) => t.id === id)
    if (!token) throw new Error("Token not found")
    token.used = true
  })

  return repo
}
