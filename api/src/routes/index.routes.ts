import { verifyJwt } from "@/middlewares/auth.middleware"
import type { FastifyInstance } from "fastify"
import { authRoutes } from "./auth.route"
import { commentRoutes } from "./comment.route"
import { publicRoutes } from "./public.routes"
import { threadRoutes } from "./thread.route"
import { userRoutes } from "./user.route"

export function registerRoutes(app: FastifyInstance) {
  app.register(
    async (fastifyInstance) => {
      fastifyInstance.register(publicRoutes)
    },
    { prefix: "/api" },
  )

  app.register(
    async (fastifyInstance) => {
      fastifyInstance.addHook("onRequest", verifyJwt)

      fastifyInstance.register(authRoutes)
      fastifyInstance.register(userRoutes, { prefix: "/users" })
      fastifyInstance.register(commentRoutes, { prefix: "/comments" })
      fastifyInstance.register(threadRoutes, { prefix: "/threads" })
    },
    { prefix: "/api" },
  )
}
