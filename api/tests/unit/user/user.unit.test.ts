import { comparePassword } from "@/lib/utils/crypto.utils"
import type { CreateUserInput, UpdateUserInput } from "@/schemas/user.schema"
import { createUserServiceMock, mockConstants } from "tests/mocks"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"

const {
  user: { id: userId, email, password },
} = mockConstants

const userService = createUserServiceMock()

describe("User Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should create a user with valid data", async () => {
    const validUserData: CreateUserInput = {
      email: "another@example.com",
      name: "Test User",
      password,
    }

    const user = await userService.createUser(validUserData)

    expect(user).toHaveProperty("id")
    expect(user.email).toEqual(validUserData.email)
  })

  it("should throw validation error when email is invalid", async () => {
    const invalidUserData = {
      email: "invalid-email",
      name: "Test User",
      password,
    }

    await expect(userService.createUser(invalidUserData)).rejects.toThrow(ZodError)
  })

  it("should get user by id", async () => {
    const user = await userService.getUserById(userId)

    expect(user).toHaveProperty("id")
    expect(user?.email).toEqual(email)
  })

  it("should return null when user is not found", async () => {
    const user = await userService.getUserById(0)

    expect(user).toBeNull()
  })

  it("should update user with valid data", async () => {
    const updatedUserData = {
      email,
      name: "Updated User",
    }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(user).toHaveProperty("id")
    expect(user.name).toEqual(updatedUserData.name)
  })

  it("should change user password when new password is provided", async () => {
    const updatedUserData: UpdateUserInput = {
      email,
      currentPassword: password,
      newPassword: "new-password",
      confirmPassword: "new-password",
    }

    if (!updatedUserData.newPassword) {
      throw new Error("New password is required")
    }

    const user = await userService.updateUser(userId, updatedUserData)
    if (!user || !user.password) throw new Error("User not found")

    expect(await comparePassword(updatedUserData.newPassword, user.password)).toBe(true)
    expect(user).toHaveProperty("id")
  })

  it("should throw error when current password is incorrect", async () => {
    const updatedUserData: UpdateUserInput = {
      email,
      currentPassword: "wrong-password",
      newPassword: "new-password",
      confirmPassword: "new-password",
    }

    await expect(userService.updateUser(userId, updatedUserData)).rejects.toThrow("Invalid current password")
  })

  it("should throw error when new password and confirm password do not match", async () => {
    const updatedUserData: UpdateUserInput = {
      email,
      currentPassword: password,
      newPassword: "new-password",
      confirmPassword: "different-password",
    }

    await expect(userService.updateUser(userId, updatedUserData)).rejects.toThrow("Passwords do not match")
  })

  it("should not change user password when password is not provided", async () => {
    const updatedUserData = {
      email,
      name: "Updated User",
    }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(user).toHaveProperty("id")
    expect(user.password).not.toEqual(password)
  })

  it("should change user picture when new picture is provided", async () => {
    const updatedUserData = { picture: "new-picture-path" }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(user).toHaveProperty("id")
    expect(user.picture).toEqual(updatedUserData.picture)
  })
})
