import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { tokenSchema, verifyToken } from "@/lib/utils/jwt.utils"
import { mockConstants } from "tests/mocks/constants"
import { createMockServices } from "tests/mocks/factories"
import { beforeEach, describe, expect, it, vi } from "vitest"

const {
  user: { email, password },
} = mockConstants

const { authService } = createMockServices()

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

  it("should refresh the token", async () => {
    const token = await authService.login(email, password)

    const decoded = await verifyToken(token)
    const newToken = await authService.refresh(decoded.id)
    const newDecoded = await verifyToken(newToken)

    expect(newDecoded).toHaveProperty("id")
    expect(newDecoded).toHaveProperty("email")
    expect(newDecoded.id).toEqual(decoded.id)
    expect(newDecoded.email).toEqual(decoded.email)
  })

  it("should throw an error when refreshing with an invalid token", async () => {
    await expect(authService.refresh(0)).rejects.toThrow(InvalidCredentialsError)
  })
})
