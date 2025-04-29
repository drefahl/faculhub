import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import type { AuthInput } from "@/schemas/auth.schema"
import type { AuthService } from "@/services/auth.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(request: FastifyRequest<{ Body: AuthInput }>, reply: FastifyReply) {
    try {
      const { email, password } = request.body

      const token = await this.authService.login(email, password)

      return reply.send({ token })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.code(401).send({ message: error.message })
      }

      return reply.code(500).send({ message: "Internal Server Error" })
    }
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const token = await this.authService.refresh(request.user.id)

    return reply.send({ token })
  }
}
