import { config } from "dotenv"
import { z } from "zod"

config({ path: process.env.NODE_ENV !== "production" ? ".env.development" : ".env" })

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOSTNAME: z.string().default("localhost"),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().trim(),
  GOOGLE_CLIENT_ID: z.string().trim(),
  GOOGLE_CLIENT_SECRET: z.string().trim(),
  GOOGLE_CALLBACK_URI: z.string().default("http://localhost:3333/login/google/callback"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  RESEND_API_KEY: z.string().trim(),
  HASH_SECRET: z.string().trim(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format())

  throw new Error("Invalid environment variables.")
}

export const env = _env.data
