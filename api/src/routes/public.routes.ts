import type { FastifyInstance } from "fastify"
import z from "zod"
import { authPublicRoutes } from "./auth.route"
import { commentPublicRoutes } from "./comment.route"
import { filePublicRoutes } from "./file.route"
import { threadPublicRoutes } from "./thread.route"
import { userPublicRoutes } from "./user.route"

export async function publicRoutes(app: FastifyInstance) {
  app.register(authPublicRoutes)

  app.register(commentPublicRoutes, { prefix: "/comments" })

  app.register(filePublicRoutes, { prefix: "/files" })

  app.register(threadPublicRoutes, { prefix: "/threads" })

  app.register(userPublicRoutes, { prefix: "/users" })

  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        operationId: "health",
        response: {
          200: z.object({
            status: z.literal("ok"),
            time: z.string(),
            uptime: z.number(),
          }),
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
