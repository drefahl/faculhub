import { env } from "@/config/env.config"

export function buildApiUrl() {
  return `http${env.NODE_ENV === "production" ? "s" : ""}://${env.HOSTNAME}:${env.PORT}`
}
