import { NotFoundError } from "@/errors/NotFoundError"
import { createLikeService } from "@/factories/serviceFactory"
import { prisma } from "@/lib/prisma"
import type { LikeService } from "@/services/like.service"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"

describe("LikeService Integration", () => {
  let likeService: LikeService
  let userId: number
  let postId: number

  beforeEach(async () => {
    await resetDatabase()

    const user = await prisma.user.create({ data: { name: "User", email: "u@u.com", password: "123456" } })
    userId = user.id
    const post = await prisma.post.create({
      data: { title: "Post", content: "Content", type: "NEWS", author: { connect: { id: userId } } },
    })
    postId = post.id
    likeService = createLikeService()
  })

  it("should like and count correctly", async () => {
    const like = await likeService.likePost(userId, postId)
    expect(like.id).toBeDefined()

    const { count } = await likeService.countLikes(postId)
    expect(count).toBe(1)

    expect(await likeService.verifyLike(userId, postId)).toBe(true)
  })

  it("should not allow double like", async () => {
    await likeService.likePost(userId, postId)
    await expect(likeService.likePost(userId, postId)).rejects.toThrow("Post already liked")
  })

  it("should unlike and count zero", async () => {
    await likeService.likePost(userId, postId)
    await likeService.unlikePost(userId, postId)
    const { count } = await likeService.countLikes(postId)
    expect(count).toBe(0)
  })

  it("should throw when unliking not liked", async () => {
    await expect(likeService.unlikePost(userId, postId)).rejects.toBeInstanceOf(NotFoundError)
  })
})
