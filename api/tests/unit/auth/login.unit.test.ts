import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { tokenSchema, verifyToken } from "@/lib/utils/jwt.utils"
import { createAuthServiceMock, mockConstants } from "tests/mocks"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  user: { email, password },
} = mockConstants

const authService = createAuthServiceMock()

describe("Credentials Login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should login with valid credentials and return a valid token", async () => {
    const token = await authService.login(email, password)

    expect(token).toBeDefined()

    const decoded = await verifyToken(token)

    expect(decoded).toHaveProperty("id")
    expect(decoded).toHaveProperty("email")
  })

  it("should throw an error with invalid credentials", async () => {
    await expect(authService.login(email, "invalid-password")).rejects.toThrow(InvalidCredentialsError)
  })
})

describe("Google Login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should login with valid google credentials and return a valid token", async () => {
    const token = await authService.googleLogin({
      id_token: "valid-google-token",
      access_token: "token",
      expires_in: 3600,
      expires_at: new Date(),
      token_type: "Bearer",
    })

    expect(token).toBeDefined()

    const decoded = await verifyToken(token)
    tokenSchema.parse(decoded)
  })

  it("should throw an error with invalid google credentials", async () => {
    await expect(
      authService.googleLogin({
        id_token: "invalid-google-token",
        access_token: "token",
        expires_in: 3600,
        expires_at: new Date(),
        token_type: "Bearer",
      }),
    ).rejects.toThrow(InvalidCredentialsError)
  })
})
