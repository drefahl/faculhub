import { adminCheck, attachUser, verifyJwt } from "@/middlewares/auth.middleware"
import type { FastifyInstance } from "fastify"
import { authRoutes } from "./auth.route"
import { categoryRoutes } from "./category.routes"
import { commentRoutes } from "./comment.route"
import { courseRoutes } from "./course.route"
import { likeRoutes } from "./like.route"
import { postRoutes } from "./post.route"
import { publicRoutes } from "./public.routes"
import { threadRoutes } from "./thread.route"
import { userRoutes } from "./user.route"

export function registerRoutes(app: FastifyInstance) {
  app.register(
    async (fastifyInstance) => {
      fastifyInstance.addHook("onRequest", attachUser)

      fastifyInstance.register(publicRoutes)
    },
    { prefix: "/api" },
  )

  app.register(
    async (fastifyInstance) => {
      fastifyInstance.addHook("onRequest", verifyJwt)

      fastifyInstance.register(authRoutes)
      fastifyInstance.register(commentRoutes, { prefix: "/comments" })
      fastifyInstance.register(likeRoutes, { prefix: "/likes" })
      fastifyInstance.register(postRoutes, { prefix: "/posts" })
      fastifyInstance.register(threadRoutes, { prefix: "/threads" })
      fastifyInstance.register(userRoutes, { prefix: "/users" })
    },
    { prefix: "/api" },
  )

  app.register(
    async (fastifyInstance) => {
      fastifyInstance.addHook("onRequest", verifyJwt)
      fastifyInstance.addHook("onRequest", adminCheck)

      fastifyInstance.register(categoryRoutes, { prefix: "/categories" })
      fastifyInstance.register(courseRoutes, { prefix: "/courses" })
    },
    { prefix: "/api" },
  )
}
