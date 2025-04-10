import { env } from "@/config/env.config"
import { AuthController } from "@/controllers/auth.controller"
import { createAuthService } from "@/factories/serviceFactory"
import { createCookieOptions } from "@/lib/utils/cookie.utils"
import { RequestBodyAuthSchema, ResponseBodyAuthSchema } from "@/schemas/auth.schema"
import type { FastifyInstance } from "fastify"

const authService = createAuthService()
const authController = new AuthController(authService)

export async function authPublicRoutes(app: FastifyInstance) {
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

export async function authRoutes(app: FastifyInstance) {
  app.get(
    "/refresh",
    {
      schema: {
        tags: ["Auth"],
        operationId: "refresh",
        response: ResponseBodyAuthSchema,
      },
    },
    authController.refresh.bind(authController),
  )
}
