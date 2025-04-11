import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { createCookieOptions } from "@/lib/utils/cookie.utils"
import type { AuthInput } from "@/schemas/auth.schema"
import type { AuthService } from "@/services/auth.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(request: FastifyRequest<{ Body: AuthInput }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body

      const token = await this.authService.login(email, password)

      reply.setCookie("authToken", token, createCookieOptions()).send({ message: "Authenticated successfully" })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        reply.code(401).send({ message: error.message })
        return
      }

      reply.code(500).send({ message: "Internal Server Error" })
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const token = await this.authService.refresh(request.user.id)

    reply.setCookie("authToken", token, createCookieOptions()).send({ message: "Authenticated successfully" })
  }
}
