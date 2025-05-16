import type { PasswordResetService } from "@/services/password-reset.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class PasswordResetController {
  constructor(private readonly service: PasswordResetService) {}

  async request(request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) {
    const { email } = request.body
    await this.service.requestReset(email)

    reply.code(200)
  }

  async reset(request: FastifyRequest<{ Body: { token: string; password: string } }>, reply: FastifyReply) {
    const { token, password } = request.body

    const success = await this.service.resetPassword(token, password)
    if (!success) return reply.code(400).send({ error: "Invalid token or password" })

    reply.code(200)
  }
}
