import "@fastify/jwt"
import type { OAuth2Namespace } from "@fastify/oauth2"
import type { Server } from "socket.io"

export interface JWTPayload {
  id: number
  email: string
  name: string
  picture: string | null
  providers: ["google"] | ["credentials"] | ["google", "credentials"]
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
    io: Server
  }
}
