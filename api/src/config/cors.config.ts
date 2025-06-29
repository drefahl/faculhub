import fastifyCors from "@fastify/cors"
import type { FastifyInstance } from "fastify"

export function corsConfig(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
}
