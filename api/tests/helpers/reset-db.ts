import { prisma } from "@/lib/prisma"

export async function resetDatabase() {
  await prisma.$transaction([
    prisma.passwordReset.deleteMany(),
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.thread.deleteMany(),
    prisma.category.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
    prisma.course.deleteMany(),
  ])
}
