import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { tokenSchema, verifyToken } from "@/lib/utils/jwt.utils"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"
import { mockConstants } from "./mocks/constants"
import { createMockServices } from "./mocks/factories"

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
    await expect(authService.login(email, "wR0ngP@assWord")).rejects.toThrow(InvalidCredentialsError)
  })

  it("should throw an error with empty email", async () => {
    await expect(authService.login("", password)).rejects.toThrow(ZodError)
  })

  it("should throw an error with short password", async () => {
    await expect(authService.login(email, "123")).rejects.toThrow(ZodError)
  })

  it("should throw an error with empty password", async () => {
    await expect(authService.login(email, "")).rejects.toThrow(ZodError)
  })

  it("should throw an error with password containing only numbers", async () => {
    await expect(authService.login(email, "1234567890")).rejects.toThrow(ZodError)
  })

  it("should throw an error with password containing only letters", async () => {
    await expect(authService.login(email, "abcdefghij")).rejects.toThrow(ZodError)
  })

  it("should throw an error with password containing only special characters", async () => {
    await expect(authService.login(email, "!@#$%^&*()")).rejects.toThrow(ZodError)
  })

  it("should throw an error with password containing only spaces", async () => {
    await expect(authService.login(email, "          ")).rejects.toThrow(ZodError)
  })

  it("should throw an error with password containing only letters and numbers", async () => {
    await expect(authService.login(email, "abcdefghij1234567890")).rejects.toThrow(ZodError)
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
