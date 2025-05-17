import fastifyJwt from "@fastify/jwt"
import fastifyMultipart from "@fastify/multipart"
import { fastify } from "fastify"
import fastifyIo from "fastify-socket.io"
import { type ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import { corsConfig } from "./config/cors.config"
import { env } from "./config/env.config"
import { errorHandler } from "./config/errorHandler.config"
import { envToLogger } from "./config/logger.config"
import { registerGoogleOAuth } from "./config/oauth.config"
import { swaggerConfig } from "./config/swagger.config"
import { registerRoutes } from "./routes/index.routes"

export async function createServer() {
  const app = fastify({ logger: envToLogger[env.NODE_ENV] ?? true }).withTypeProvider<ZodTypeProvider>()

  // Compilers
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  // Plugins
  corsConfig(app)
  swaggerConfig(app)
  registerGoogleOAuth(app)
  app.register(fastifyJwt, { secret: env.JWT_SECRET, sign: { algorithm: "HS256" } })
  app.register(fastifyMultipart, { limits: { fileSize: 5 * 1024 * 1024 } })
  app.register(fastifyIo, { cors: { origin: true } })

  // Error Handling
  app.setErrorHandler(errorHandler)

  // Routes
  registerRoutes(app)

  await app.ready()

  app.io.on("connection", (socket) => {
    socket.on("join:thread", (threadId: number) => {
      socket.join(`thread:${threadId}`)
    })

    socket.on("leave:thread", (threadId: number) => {
      socket.leave(`thread:${threadId}`)
    })
  })

  return app
}
