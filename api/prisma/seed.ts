import { APP_CONSTANTS } from "@/constants"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: APP_CONSTANTS.DEFAULT_USER.email },
  })

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: APP_CONSTANTS.DEFAULT_USER.email,
        name: "Admin User",
        password: await hash(APP_CONSTANTS.DEFAULT_USER.password, 10),
      },
    })
  }

  const existingThread = await prisma.thread.findFirst({
    where: { title: APP_CONSTANTS.DEFAULT_THREAD.title },
  })

  if (!existingThread) {
    await prisma.thread.create({
      data: {
        title: APP_CONSTANTS.DEFAULT_THREAD.title,
        content: APP_CONSTANTS.DEFAULT_THREAD.content,
        authorId: 1,
      },
    })
  }

  const existingComment = await prisma.comment.findFirst({
    where: { content: APP_CONSTANTS.DEFAULT_COMMENT.content },
  })

  if (!existingComment) {
    await prisma.comment.create({
      data: {
        content: APP_CONSTANTS.DEFAULT_COMMENT.content,
        authorId: APP_CONSTANTS.DEFAULT_COMMENT.authorId,
        threadId: APP_CONSTANTS.DEFAULT_COMMENT.threadId,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error("Erro ao rodar a seed:", e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
