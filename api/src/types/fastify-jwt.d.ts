import "@fastify/jwt"
import type { OAuth2Namespace } from "@fastify/oauth2"

export interface JWTPayload {
  id: number
  email: string
}

declare module "@fastify/jwt" {
  interface FastifyRequest {
    user: JWTPayload
  }

  interface FastifyJWT {
    payload: { id: string }
    user: JWTPayload
  }
}

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace
  }
}
