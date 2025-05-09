import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class PostRepository {
  async createPost(data: Prisma.postCreateInput) {
    return prisma.post.create({ data, select })
  }

  async getPostById(id: number, userId?: number) {
    return prisma.post.findUnique({
      where: { id },
      select: {
        ...select,
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : undefined,
      },
    })
  }

  async updatePost(id: number, data: Prisma.postUpdateInput) {
    return prisma.post.update({ where: { id }, data, select })
  }

  async deletePost(id: number) {
    return prisma.post.delete({ where: { id }, select })
  }

  async listPosts({
    take,
    skip,
    search,
    course,
    type,
    userId,
  }: {
    take: number
    skip: number
    search?: string
    course?: number
    type?: "EVENT" | "NEWS"
    userId?: number
  }) {
    const where: Prisma.postWhereInput = {
      title: search ? { contains: search, mode: "insensitive" } : undefined,
      ...(course ? { courses: { some: { id: { equals: course } } } } : {}),
      ...(type ? { type } : {}),
    }

    const [total, posts] = await prisma.$transaction([
      prisma.post.count({ where }),
      prisma.post.findMany({
        take,
        skip,
        where,
        select: {
          ...select,
          likes: userId
            ? {
                where: { userId },
                select: { id: true },
              }
            : undefined,
        },
      }),
    ])

    const page = Math.floor(skip / take) + 1
    const totalPages = Math.ceil(total / take)

    return {
      data: posts,
      total,
      page,
      perPage: take,
      totalPages,
    }
  }

  async incrementViews(id: number, userId?: number) {
    return prisma.post.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: {
        ...select,
        likes: userId
          ? {
              where: { userId },
              select: { id: true },
            }
          : undefined,
      },
    })
  }
}

const select = {
  id: true,
  title: true,
  content: true,
  type: true,
  isPinned: true,
  eventDate: true,
  location: true,
  views: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: { id: true, name: true, profilePicId: true },
  },
  courses: {
    select: { id: true, name: true, code: true },
  },
  _count: { select: { likes: true } },
  comments: true,
} as const
