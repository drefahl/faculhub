import type { Session } from "@/types/fastify-jwt"
import type { user } from "@prisma/client"

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

export function isUserAdmin(payload: Session): boolean {
  return payload.role === "ADMIN"
}
