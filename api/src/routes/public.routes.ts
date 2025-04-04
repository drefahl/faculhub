import { healthCheckSchema } from "@/schemas/health.schema"
import type { FastifyInstance } from "fastify"
import { authRoutes } from "./auth.route"
import { userPublicRoutes } from "./user.route"

export async function publicRoutes(app: FastifyInstance) {
  app.register(authRoutes)

  app.register(userPublicRoutes, { prefix: "/users" })

  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        operationId: "health",
        response: {
          200: healthCheckSchema,
        },
      },
    },
    (_, reply) => {
      reply.send({
        status: "ok",
        time: new Date().toISOString(),
        uptime: process.uptime(),
      })
    },
  )
}
