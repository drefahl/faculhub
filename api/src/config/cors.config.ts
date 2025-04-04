import fastifyCors from "@fastify/cors"
import type { FastifyInstance } from "fastify"

export function corsConfig(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
}
