import { config } from "dotenv"
import { z } from "zod"

config({ path: process.env.NODE_ENV !== "production" ? ".env.development" : ".env" })

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().trim(),
  GOOGLE_CLIENT_ID: z.string().trim(),
  GOOGLE_CLIENT_SECRET: z.string().trim(),
  GOOGLE_CALLBACK_URI: z.string().default("http://localhost:3333/api/login/google/callback"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format())

  throw new Error("Invalid environment variables.")
}

export const env = _env.data
