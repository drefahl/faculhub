import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { hashPassword } from "@/lib/utils/crypto.utils"
import { createToken } from "@/lib/utils/jwt.utils"
import { UserRepository } from "@/repositories/user.repository"
import { AuthService } from "@/services/auth.service"
import { UserService } from "@/services/user.service"
import { vi } from "vitest"

export const mockConstants = {
  user: {
    id: 1,
    email: "johnDoe@example.com",
    name: "John Doe",
    password: "password",
    picture: null,
    googleId: null,
  },
} as const

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
      picture: data?.picture ?? null,
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
      picture: null,
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
      picture: null,
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
      picture: typeof data?.picture === "string" ? data.picture : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  return service
}

export function createUserServiceMock(userRepository: UserRepository = createUserRepositoryMock()): UserService {
  const service = new UserService(userRepository)

  vi.spyOn(service, "getUserById").mockImplementation(async (userId: number) => {
    if (userId !== mockConstants.user.id) return null

    return {
      id: mockConstants.user.id,
      googleId: null,
      email: mockConstants.user.email,
      name: mockConstants.user.name,
      password: mockConstants.user.password,
      picture: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  return service
}

export function createAuthServiceMock(userService: UserService = createUserServiceMock()): AuthService {
  const service = new AuthService(userService)

  vi.spyOn(service, "login").mockImplementation(async (email: string, password: string) => {
    if (email !== mockConstants.user.email || password !== mockConstants.user.password) {
      throw new InvalidCredentialsError("Invalid credentials")
    }
    return createToken({ id: mockConstants.user.id, email: mockConstants.user.email })
  })

  return service
}

vi.mock("google-auth-library", () => {
  return {
    OAuth2Client: vi.fn().mockImplementation(() => ({
      verifyIdToken: vi.fn().mockImplementation(async ({ idToken }) => {
        if (idToken !== "valid-google-token") throw new Error("Invalid Google token")

        return {
          getPayload: () => ({
            email: mockConstants.user.email,
            name: mockConstants.user.name,
            picture: "http://example.com/profile.jpg",
            sub: "google-sub-id",
          }),
        }
      }),
    })),
  }
})
