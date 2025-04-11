import type { Session } from "@/types/fastify-jwt"
import type { user } from "@prisma/client"
import { buildApiUrl } from "./app.utils"

export function getUserProviders(user: user): Array<"google" | "credentials"> {
  const providers: Array<"google" | "credentials"> = []
  if (user.password) {
    providers.push("credentials")
  }

  if (user.googleId) {
    providers.push("google")
  }

  return providers
}

export function getProfilePictureUrl(profilePicId: string | null): string | null {
  return profilePicId ? `${buildApiUrl()}/api/files/${profilePicId}` : null
}

export function isUserAdmin(payload: Session): boolean {
  return payload.role === "ADMIN"
}
