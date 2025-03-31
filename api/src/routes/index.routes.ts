import { verifyJwt } from "@/middlewares/auth.middleware"
import type { FastifyInstance } from "fastify"
import { publicRoutes } from "./public.routes"
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

      fastifyInstance.register(userRoutes, { prefix: "/users" })
    },
    { prefix: "/api" },
  )
}
