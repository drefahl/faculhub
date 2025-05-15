import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { hashPassword } from "@/lib/utils/crypto.utils"
import { tokenSchema, verifyToken } from "@/lib/utils/jwt.utils"
import { AuthService } from "@/services/auth.service"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

describe("AuthService (unit)", () => {
  let authService: AuthService
  const email = "test@example.com"
  const password = "StrongP@ss1"

  const mockUserService = {
    getUserById: vi.fn(),
    getUserByEmail: vi.fn(),
    createUserWithGoogle: vi.fn(),
    updateUser: vi.fn(),
  }

  const mockFileService = {
    createFile: vi.fn(),
    deleteFile: vi.fn(),
    getFileById: vi.fn(),
  }

  beforeEach(async () => {
    vi.clearAllMocks()

    const hashed = await hashPassword(password)
    const userData = {
      id: 1,
      email,
      password: hashed,
      name: "Test User",
      profilePicId: null,
      role: "USER",
      providers: ["credentials"],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUserService.getUserById.mockResolvedValue(userData)
    mockUserService.getUserByEmail.mockResolvedValue(userData)
    mockUserService.updateUser.mockResolvedValue(userData)

    authService = new AuthService(mockUserService as any, mockFileService as any)
  })

  describe("Credentials Login", () => {
    it("returns a valid JWT for correct credentials", async () => {
      const token = await authService.login(email, password)
      expect(typeof token).toBe("string")

      const decoded = await verifyToken(token)
      tokenSchema.parse(decoded)
    })

    it("throws ZodError for invalid inputs", async () => {
      const invalids = ["", "123", "abcdefghij", "!@#$%^&*()", "          ", "abc123xyz456"]
      await expect(() => authService.login("", password)).rejects.toBeInstanceOf(ZodError)
      for (const pass of invalids) {
        await expect(() => authService.login(email, pass)).rejects.toBeInstanceOf(ZodError)
      }
    })
  })

  describe("Google Login & Refresh", () => {
    beforeEach(() => {
      // @ts-ignore
      vi.spyOn<any, any>(authService, "verifyGoogleToken").mockImplementation(async (idToken: string) => {
        if (idToken === "valid-google-token") {
          return {
            email,
            name: "Test User",
            picture: null,
            sub: "google-sub-id",
          }
        }
        return null
      })
    })

    it("returns JWT for valid Google credentials", async () => {
      const token = await authService.googleLogin({
        id_token: "valid-google-token",
        access_token: "foo",
        expires_in: 3600,
        expires_at: new Date(),
        token_type: "Bearer",
      })

      expect(typeof token).toBe("string")

      const decoded = await verifyToken(token)
      tokenSchema.parse(decoded)
    })

    it("throws InvalidCredentialsError for invalid Google credentials", async () => {
      await expect(() =>
        authService.googleLogin({
          id_token: "invalid-token",
          access_token: "foo",
          expires_in: 3600,
          expires_at: new Date(),
          token_type: "Bearer",
        }),
      ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it("refreshes a valid token", async () => {
      const token = await authService.login(email, password)
      const decoded = await verifyToken(token)

      const newToken = await authService.refresh(decoded.id)
      const newDecoded = await verifyToken(newToken)

      expect(newDecoded.id).toBe(decoded.id)
      expect(newDecoded.email).toBe(decoded.email)
    })

    it("throws InvalidCredentialsError when refreshing non-existent user", async () => {
      mockUserService.getUserById.mockResolvedValue(null)
      await expect(() => authService.refresh(999)).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
  })
})
