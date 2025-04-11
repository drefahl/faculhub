import { NotFoundError } from "@/errors/NotFoundError"
import { hashPassword } from "@/lib/utils/crypto.utils"
import { UserRepository } from "@/repositories/user.repository"
import type { user } from "@prisma/client"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createUserRepositoryMock(): UserRepository {
  const repo = new UserRepository()

  const users: Map<number, user> = new Map([
    [
      mockConstants.user.id,
      {
        id: mockConstants.user.id,
        googleId: null,
        email: mockConstants.user.email,
        name: mockConstants.user.name,
        password: mockConstants.user.hashedPassword,
        role: "USER",
        profilePicId: mockConstants.file.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  ])

  vi.spyOn(repo, "createUser").mockImplementation(async (data) => {
    const id = Math.floor(Math.random() * 1000)
    const newUser: user = {
      id,
      googleId: data?.googleId ?? null,
      email: data.email,
      name: data.name ?? null,
      password: data.password ? await hashPassword(data.password) : null,
      role: data.role ?? "USER",
      profilePicId: data?.profilePic?.connect?.id ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    users.set(id, newUser)
    return newUser
  })

  vi.spyOn(repo, "getUserById").mockImplementation(async (id) => {
    return users.get(id) ?? null
  })

  vi.spyOn(repo, "getUserByEmail").mockImplementation(async (email) => {
    for (const user of users.values()) {
      if (user.email === email) return user
    }
    return null
  })

  vi.spyOn(repo, "updateUser").mockImplementation(async (userId, data) => {
    const existingUser = users.get(userId)
    if (!existingUser) throw new NotFoundError("User not found")

    const updatedUser: user = {
      ...existingUser,
      googleId: typeof data?.googleId === "string" ? data.googleId : existingUser.googleId,
      email: typeof data?.email === "string" ? data.email : existingUser.email,
      name: typeof data?.name === "string" ? data.name : existingUser.name,
      password: data?.password && typeof data.password === "string" ? data?.password : existingUser.password,
      profilePicId: data?.profilePic?.connect?.id ?? null,
      role: typeof data?.role === "string" ? data.role : existingUser.role,
      updatedAt: new Date(),
    }
    users.set(userId, updatedUser)
    return updatedUser
  })

  return repo
}
