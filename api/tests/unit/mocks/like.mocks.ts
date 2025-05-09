import { NotFoundError } from "@/errors/NotFoundError"
import { LikeRepository } from "@/repositories/like.repository"
import type { like } from "@prisma/client"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createLikeRepositoryMock(): LikeRepository {
  const repo = new LikeRepository()

  const likes: Map<string, like> = new Map([])

  vi.spyOn(repo, "createLike").mockImplementation(async (data) => {
    const id = Date.now()
    const userId = data.user.connect?.id ?? mockConstants.user.id
    const postId = data.post.connect?.id ?? mockConstants.post.id

    const newLike: like = { id, userId, postId }

    likes.set(`${userId}-${postId}`, newLike)

    return newLike
  })

  vi.spyOn(repo, "getLike").mockImplementation(async (userId, postId) => likes.get(`${userId}-${postId}`) ?? null)

  vi.spyOn(repo, "deleteLike").mockImplementation(async (userId, postId) => {
    const key = `${userId}-${postId}`
    const existing = likes.get(key)
    if (!existing) throw new NotFoundError("Like not found")

    likes.delete(key)

    return { count: 1 }
  })

  vi.spyOn(repo, "countLikes").mockImplementation(
    async (postId) => Array.from(likes.values()).filter((l) => l.postId === postId).length,
  )

  return repo
}
