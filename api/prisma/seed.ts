import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: "admin@example.com" },
  })

  if (existingUser) return

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: await hash("admin123", 10),
    },
  })
}

main()
  .catch((e) => {
    console.error("Erro ao rodar a seed:", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
