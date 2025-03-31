import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("localhost"),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().trim(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format())

  throw new Error("Invalid environment variables.")
}

export const env = _env.data
