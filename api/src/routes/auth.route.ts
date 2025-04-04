import { env } from "@/config/env.config"
import { AuthController } from "@/controllers/auth.controller"
import { createCookieOptions } from "@/lib/utils/cookie.utils"
import { RequestBodyAuthSchema, ResponseBodyAuthSchema } from "@/schemas/auth.schema"
import { AuthService } from "@/services/auth.service"
import type { FastifyInstance } from "fastify"

export async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService()
  const authController = new AuthController(authService)

  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        operationId: "login",
        body: RequestBodyAuthSchema,
        response: ResponseBodyAuthSchema,
      },
    },
    authController.login.bind(authController),
  )

  app.get(
    "/login/google/callback",
    {
      schema: {
        tags: ["Auth"],
        response: ResponseBodyAuthSchema,
      },
    },
    async (request, reply) => {
      const { token } = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

      const authToken = await authService.googleLogin(token)

      return reply.setCookie("authToken", authToken, createCookieOptions()).redirect(env.FRONTEND_URL)
    },
  )
}
