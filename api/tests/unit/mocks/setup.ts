import { vi } from "vitest"
import { mockConstants } from "./constants"

vi.mock("google-auth-library", () => {
  return {
    OAuth2Client: vi.fn().mockImplementation(() => ({
      verifyIdToken: vi.fn().mockImplementation(async ({ idToken }) => {
        if (idToken !== "valid-google-token") throw new Error("Invalid Google token")

        return {
          getPayload: () => ({
            email: mockConstants.user.email,
            name: mockConstants.user.name,
            picture: "https://placehold.co/600x400",
            sub: "google-sub-id",
          }),
        }
      }),
    })),
  }
})
