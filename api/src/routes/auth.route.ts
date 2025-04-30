import { env } from "@/config/env.config"
import { AuthController } from "@/controllers/auth.controller"
import { createAuthService } from "@/factories/serviceFactory"

import type { FastifyInstance } from "fastify"
import z from "zod"

const authService = createAuthService()
const authController = new AuthController(authService)

export async function authPublicRoutes(app: FastifyInstance) {
  app.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        operationId: "login",
        body: z.object({ email: z.string(), password: z.string() }),
        response: {
          200: z.object({ token: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    authController.login.bind(authController),
  )

  app.get(
    "/login/google/callback",
    {
      schema: {
        tags: ["Auth"],
        response: {
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { token } = await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request)

      const authToken = await authService.googleLogin(token)

      return reply.redirect(`${env.FRONTEND_URL}/api/auth/google/callback?token=${authToken}`)
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
        response: {
          200: z.object({ token: z.string() }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    authController.refresh.bind(authController),
  )
}
