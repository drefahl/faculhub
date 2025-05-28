import { buildApiUrl } from "@/lib/utils/app.utils"
import { fastifySwagger } from "@fastify/swagger"
import { fastifySwaggerUi } from "@fastify/swagger-ui"
import type { FastifyInstance } from "fastify"
import { jsonSchemaTransform } from "fastify-type-provider-zod"

export function swaggerConfig(app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "API documentation",
        version: "1.0.0",
      },
      servers: [
        {
          url: buildApiUrl(),
        },
      ],
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUi, { routePrefix: "/docs" })
}
