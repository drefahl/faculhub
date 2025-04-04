import { execSync } from "node:child_process"
import { randomUUID } from "node:crypto"
import path from "node:path"
import { config } from "dotenv"
import { afterAll, beforeAll } from "vitest"

const projectRoot = path.resolve(__dirname, "../../")
config({
  override: true,
  path: path.join(projectRoot, ".env.development"),
})

const schema = randomUUID()
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not defined")

import { prisma } from "@/lib/prisma"

const url = new URL(process.env.DATABASE_URL)
url.searchParams.set("schema", schema)
const DATABASE_URL = url.toString()

beforeAll(async () => {
  try {
    execSync("npx prisma db push --schema=prisma/schema.prisma --force-reset", {
      env: { ...process.env, DATABASE_URL },
      cwd: projectRoot,
    })
  } catch (error) {
    console.error("Error executing Prisma db push:", error)
    throw error
  }
}, 30000)

afterAll(async () => {
  try {
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)

    await prisma.$disconnect()
  } catch (error) {
    console.error("Error executing reset in afterAll:", error)
    throw error
  }
}, 30000)
