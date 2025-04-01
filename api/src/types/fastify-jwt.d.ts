import "@fastify/jwt"

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
