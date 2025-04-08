import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { createToken } from "@/lib/utils/jwt.utils"
import { AuthService } from "@/services/auth.service"
import type { UserService } from "@/services/user.service"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createAuthServiceMock(userService: UserService): AuthService {
  const service = new AuthService(userService)

  vi.spyOn(service, "login").mockImplementation(async (email: string, password: string) => {
    if (email !== mockConstants.user.email || password !== mockConstants.user.password) {
      throw new InvalidCredentialsError("Invalid credentials")
    }

    return createToken({
      id: mockConstants.user.id,
      email: mockConstants.user.email,
      name: mockConstants.user.name,
      picture: null,
      providers: ["credentials"],
    })
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
