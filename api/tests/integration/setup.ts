import { execSync } from "node:child_process"
import path from "node:path"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/utils/crypto.utils"
import { config } from "dotenv"
import { afterEach, beforeAll, beforeEach } from "vitest"
import { constants } from "./utils/constants"

const projectRoot = path.resolve(__dirname, "../../")
config({
  override: true,
  path: path.join(projectRoot, ".env.development"),
})

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not defined")
const url = new URL(process.env.DATABASE_URL)
url.searchParams.set("schema", "test")
const DATABASE_URL = url.toString()

beforeAll(async () => {
  try {
    execSync("npx prisma db push --schema=prisma/schema.prisma", {
      env: { ...process.env, DATABASE_URL },
      cwd: projectRoot,
    })

    const user = await prisma.user.findUnique({ where: { email: constants.admin.email } })
    if (!user) {
      await prisma.user.create({
        data: {
          ...constants.admin,
          password: await hashPassword(constants.admin.password),
        },
      })
    }
  } catch (error) {
    console.error("Error executing Prisma db push:", error)
    throw error
  }
}, 30000)

beforeEach(async () => {
  await prisma.$executeRaw`START TRANSACTION`
})

afterEach(async () => {
  await prisma.$executeRaw`ROLLBACK`
})
