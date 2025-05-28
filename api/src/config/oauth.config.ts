import fastifyOauth2 from "@fastify/oauth2"
import type { FastifyInstance } from "fastify"
import { env } from "./env.config"

export function registerGoogleOAuth(app: FastifyInstance) {
  app.register(fastifyOauth2, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: env.GOOGLE_CLIENT_ID,
        secret: env.GOOGLE_CLIENT_SECRET,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/login/google",
    callbackUri: env.GOOGLE_CALLBACK_URI,
    callbackUriParams: {
      access_type: "offline",
    },
    pkce: "S256",
    schema: {
      tags: ["Auth"],
      operationId: "googleLogin",
    },
  })
}
