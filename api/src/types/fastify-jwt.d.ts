import "@fastify/jwt"
import type { OAuth2Namespace } from "@fastify/oauth2"
import type { Server } from "socket.io"

export interface Session {
  id: number
  email: string
  name: string
  picture: string | null
  role: "USER" | "ADMIN"
  providers: ["google"] | ["credentials"] | ["google", "credentials"]
}

declare module "@fastify/jwt" {
  interface FastifyRequest {
    user: Session
  }

  interface FastifyJWT {
    payload: { id: string }
    user: Session
  }
}

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace
    io: Server
  }
}
