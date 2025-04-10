import { hashPassword } from "@/lib/utils/crypto.utils"
import { UserRepository } from "@/repositories/user.repository"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createUserRepositoryMock(): UserRepository {
  const service = new UserRepository()

  vi.spyOn(service, "createUser").mockImplementation(async (data) => {
    return {
      ...data,
      id: mockConstants.user.id,
      googleId: data?.googleId ?? null,
      email: data?.email ?? mockConstants.user.email,
      name: mockConstants.user.name,
      password: await hashPassword(mockConstants.user.password),
      profilePicId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(service, "getUserById").mockImplementation(async (id) => {
    if (id !== mockConstants.user.id) return null

    return {
      id: mockConstants.user.id,
      googleId: null,
      email: mockConstants.user.email,
      name: mockConstants.user.name,
      password: await hashPassword(mockConstants.user.password),
      profilePicId: mockConstants.file.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(service, "getUserByEmail").mockImplementation(async (email) => {
    if (email !== mockConstants.user.email) return null

    return {
      id: mockConstants.user.id,
      googleId: null,
      email: mockConstants.user.email,
      name: mockConstants.user.name,
      password: await hashPassword(mockConstants.user.password),
      profilePicId: mockConstants.file.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(service, "updateUser").mockImplementation(async (userId, data) => {
    if (userId !== mockConstants.user.id) throw new Error("User not found")

    return {
      id: mockConstants.user.id,
      googleId: null,
      email: typeof data?.email === "string" ? data.email : mockConstants.user.email,
      name: typeof data?.name === "string" ? data.name : mockConstants.user.name,
      password: typeof data?.password === "string" ? data.password : await hashPassword(mockConstants.user.password),
      profilePicId: data?.profilePic?.connect?.id ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  return service
}
