import { NotFoundError } from "@/errors/NotFoundError"
import type { LikeService } from "@/services/like.service"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { mockConstants } from "./mocks/constants"
import { createMockServices } from "./mocks/factories"

let likeService: LikeService

describe("Like Service Unit Tests", () => {
  beforeEach(() => {
    likeService = createMockServices().likeService
  })

  it("should like a post successfully", async () => {
    const like = await likeService.likePost(mockConstants.user.id, mockConstants.post.id)

    expect(like).toHaveProperty("id")
    expect(like.userId).toBe(mockConstants.user.id)
    expect(like.postId).toBe(mockConstants.post.id)
  })

  it("should not allow liking a post twice", async () => {
    await likeService.likePost(mockConstants.user.id, mockConstants.post.id)

    await expect(likeService.likePost(mockConstants.user.id, mockConstants.post.id)).rejects.toThrow(
      "Post already liked",
    )
  })

  it("should unlike a post successfully", async () => {
    await likeService.likePost(mockConstants.user.id, mockConstants.post.id)
    await likeService.unlikePost(mockConstants.user.id, mockConstants.post.id)

    const { count } = await likeService.countLikes(mockConstants.post.id)

    expect(count).toBe(0)
  })

  it("should throw an error when unliking a post that is not liked", async () => {
    await expect(likeService.unlikePost(mockConstants.user.id, 0)).rejects.toThrow(NotFoundError)
    await expect(likeService.unlikePost(mockConstants.user.id, 0)).rejects.toThrow("Like not found")
  })

  it("should count likes on a post", async () => {
    await likeService.likePost(mockConstants.user.id, mockConstants.post.id)

    const { count } = await likeService.countLikes(mockConstants.post.id)

    expect(count).toBe(1)
  })

  it("should count zero likes on a post with no likes", async () => {
    try {
      await likeService.unlikePost(mockConstants.user.id, mockConstants.post.id)
    } catch (error) {}

    const { count } = await likeService.countLikes(mockConstants.post.id)
    expect(count).toBe(0)
  })

  it("should count multiple likes on a post", async () => {
    const { likeService, likeRepository } = createMockServices()

    vi.spyOn(likeRepository, "countLikes").mockResolvedValueOnce(5)

    const { count } = await likeService.countLikes(mockConstants.post.id)
    expect(count).toBe(5)
  })
})
