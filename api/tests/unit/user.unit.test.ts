import { NotFoundError } from "@/errors/NotFoundError"
import { comparePassword } from "@/lib/utils/crypto.utils"
import type { CreateUserInput, UpdateUserInput } from "@/schemas/user.schema"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { ZodError } from "zod"
import { mockConstants } from "./mocks/constants"
import { createMockServices } from "./mocks/factories"

const {
  user: { id: userId, email, password },
} = mockConstants

const { userService, fileService } = createMockServices()

describe("User Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should create a user with valid data", async () => {
    const validUserData: CreateUserInput = {
      email: "another@example.com",
      name: "Test User",
      password: password,
    }

    const user = await userService.createUser(validUserData)

    expect(user).toHaveProperty("id")
    expect(user.email).toEqual(validUserData.email)
  })

  it("should throw validation error when email is invalid", async () => {
    const invalidUserData: CreateUserInput = {
      email: "invalid-email",
      name: "Test User",
      password: password,
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
      newPassword: "N3wP@ssword",
      confirmPassword: "N3wP@ssword",
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
      currentPassword: "W0r0ngP@ssword",
      newPassword: "N3wP@ssword",
      confirmPassword: "N3wP@ssword",
    }

    await expect(userService.updateUser(userId, updatedUserData)).rejects.toThrow("Invalid current password")
  })

  it("should throw error when new password and confirm password do not match", async () => {
    const updatedUserData: UpdateUserInput = {
      email,
      currentPassword: password,
      newPassword: "N3wP@ssword",
      confirmPassword: "DifferentP@ssword",
    }

    await expect(userService.updateUser(userId, updatedUserData)).rejects.toThrow("Passwords do not match")
  })

  it("should not change user password when password is not provided", async () => {
    const updatedUserData: UpdateUserInput = {
      email,
      name: "Updated User",
    }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(user).toHaveProperty("id")
    expect(user.password).not.toEqual(password)
  })

  it("should change user picture when new picture is provided", async () => {
    const { filename, mimeType, data } = mockConstants.file
    const createdFile = await fileService.createFile(filename, mimeType, data)

    const user = await userService.updateUserProfileImage(userId, filename, mimeType, data)

    expect(user).toHaveProperty("id")
    expect(user.profilePicId).toEqual(createdFile.id)
  })

  it("should delete user profile picture", async () => {
    const { filename, mimeType, data } = mockConstants.file
    await userService.updateUserProfileImage(userId, filename, mimeType, data)

    const user = await userService.deleteUserProfileImage(userId)

    expect(user?.profilePicId).toBeNull()
  })

  it("should throw error when user is not found", async () => {
    const { filename, mimeType, data } = mockConstants.file

    await expect(userService.updateUserProfileImage(0, filename, mimeType, data)).rejects.toThrow(NotFoundError)
  })

  it("should return an error when trying to create a user with a role other than USER", async () => {
    const userData: CreateUserInput & { role: "ADMIN" | "USER" } = {
      email: mockConstants.user.email,
      password: mockConstants.user.password,
      name: mockConstants.user.name,
      role: "ADMIN",
    }

    await expect(userService.createUser(userData)).rejects.toThrow(ZodError)
  })

  it("should throw an error when updating with a very long name", async () => {
    const updatedUserData: UpdateUserInput = { email, name: "a".repeat(256) }

    await expect(userService.updateUser(userId, updatedUserData)).rejects.toThrow(ZodError)
  })

  it("should update only the name without affecting other fields", async () => {
    const userBeforeUpdate = await userService.getUserById(userId)
    const updatedUserData = { name: "New Name" }

    const user = await userService.updateUser(userId, updatedUserData)

    expect(user.name).toBe("New Name")
    expect(user.email).toBe(userBeforeUpdate?.email)
  })
})
