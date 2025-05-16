import { PasswordResetController } from "@/controllers/password-reset.controller"
import { createPasswordResetService } from "@/factories/serviceFactory"
import { passwordSchema } from "@/schemas/common.schema"
import type { FastifyInstance } from "fastify"
import z from "zod"

export async function passwordResetRoutes(app: FastifyInstance) {
  const controller = new PasswordResetController(createPasswordResetService())

  app.post(
    "/request",
    {
      schema: {
        tags: ["Password Reset"],
        operationId: "requestPasswordReset",
        body: z.object({ email: z.string().email() }),
      },
    },
    controller.request.bind(controller),
  )

  app.post(
    "/reset",
    {
      schema: {
        tags: ["Password Reset"],
        operationId: "resetPassword",
        body: z.object({
          token: z.string(),
          password: passwordSchema,
        }),
      },
    },
    controller.reset.bind(controller),
  )
}
