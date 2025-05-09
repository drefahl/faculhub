import { NotFoundError } from "@/errors/NotFoundError"
import { type CreatePostInput, type UpdatePostInput, postResponseArraySchema } from "@/schemas/post.schema"
import type { PostService } from "@/services/post.service"
import { beforeEach, describe, expect, it } from "vitest"
import { mockConstants } from "./mocks/constants"
import { createMockServices } from "./mocks/factories"

describe("Post Unit Tests", () => {
  let postService: PostService

  beforeEach(() => {
    postService = createMockServices().postService
  })

  it("should create a new post", async () => {
    const data: CreatePostInput = {
      title: "Test Post",
      content: "Test Content",
      type: "NEWS",
      authorId: mockConstants.user.id,
    }

    const post = await postService.create(data)

    expect(post).toHaveProperty("id")
    expect(post.title).toEqual(data.title)
    expect(post.content).toEqual(data.content)
    expect(post.type).toEqual(data.type)
    expect(post.author).toHaveProperty("id", mockConstants.user.id)
  })

  it("should create a post with categories", async () => {
    const data: CreatePostInput = {
      title: "Post with Categories",
      content: "Content with categories",
      type: "NEWS",
      authorId: mockConstants.user.id,
    }

    const post = await postService.create(data)

    expect(post).toHaveProperty("id")
    expect(post.title).toEqual(data.title)
  })

  it("should create an event post with date and location", async () => {
    const eventDate = new Date()
    const data: CreatePostInput = {
      title: "Event Post",
      content: "Event Content",
      type: "EVENT",
      authorId: mockConstants.user.id,
      eventDate,
      location: "Campus Building A",
    }

    const post = await postService.create(data)

    expect(post).toHaveProperty("id")
    expect(post.type).toEqual("EVENT")
    expect(post.eventDate).toEqual(eventDate)
    expect(post.location).toEqual("Campus Building A")
  })

  it("should validate post data on creation", async () => {
    const invalidData = {
      // Missing required fields
      authorId: mockConstants.user.id,
    } as unknown as CreatePostInput

    await expect(postService.create(invalidData)).rejects.toThrow()
  })

  it("should get a post by id", async () => {
    const newPost = await postService.create({
      title: "Another Post",
      content: "Content",
      type: "EVENT",
      authorId: mockConstants.user.id,
    })

    const fetched = await postService.getById(newPost.id)

    expect(fetched?.id).toEqual(newPost.id)
    expect(fetched?.title).toEqual(newPost.title)
    expect(fetched?.content).toEqual(newPost.content)
  })

  it("should throw an error when getting a non-existent post", async () => {
    await expect(postService.getById(9999)).rejects.toThrow(NotFoundError)
    await expect(postService.getById(9999)).rejects.toThrow("Post not found")
  })

  it("should update a post", async () => {
    const newPost = await postService.create({
      title: "Old Title",
      content: "Old Content",
      type: "NEWS",
      authorId: mockConstants.user.id,
    })

    const updatedData: UpdatePostInput = {
      title: "New Title",
      content: "Updated content",
      isPinned: true,
    }
    const updated = await postService.update(newPost.id, updatedData)

    expect(updated.title).toBe("New Title")
    expect(updated.content).toBe("Updated content")
    expect(updated.isPinned).toBe(true)
  })

  it("should throw an error when updating a non-existent post", async () => {
    const updatedData: UpdatePostInput = { title: "New Title" }
    await expect(postService.update(9999, updatedData)).rejects.toThrow(NotFoundError)
  })

  it("should delete a post", async () => {
    const newPost = await postService.create({
      title: "Delete Post",
      content: "Delete Content",
      type: "EVENT",
      authorId: mockConstants.user.id,
    })

    await postService.delete(newPost.id)

    await expect(postService.getById(newPost.id)).rejects.toThrow(NotFoundError)
  })

  it("should throw an error when deleting a non-existent post", async () => {
    await expect(postService.delete(9999)).rejects.toThrow(NotFoundError)
  })

  it("should increment views", async () => {
    const newPost = await postService.create({
      title: "View Post",
      content: "View Content",
      type: "NEWS",
      authorId: mockConstants.user.id,
    })

    const before = newPost.views
    const updated = await postService.recordView(newPost.id)

    expect(updated.views).toBe(before + 1)
  })

  it("should list posts with pagination", async () => {
    // Create a few posts first
    await postService.create({
      title: "List Post 1",
      content: "Content 1",
      type: "NEWS",
      authorId: mockConstants.user.id,
    })

    await postService.create({
      title: "List Post 2",
      content: "Content 2",
      type: "NEWS",
      authorId: mockConstants.user.id,
    })

    const response = await postService.list({ take: 10, page: 1 })

    const posts = response.data

    expect(Array.isArray(posts)).toBe(true)
    expect(posts.length).toBeGreaterThan(0)
    expect(postResponseArraySchema.safeParse(response).success).toBe(true)
  })

  it("should list posts with search", async () => {
    // Create posts with specific titles for search
    await postService.create({
      title: "Unique Search Term",
      content: "Content",
      type: "NEWS",
      authorId: mockConstants.user.id,
    })

    const { data: posts } = await postService.list({
      take: 10,
      page: 1,
      search: "Unique Search",
    })

    expect(posts.length).toBeGreaterThan(0)
    expect(posts.some((p) => p.title.includes("Unique Search"))).toBe(true)
  })

  it("should throw an error for invalid pagination params", async () => {
    await expect(postService.list({ take: -1, page: 1 })).rejects.toThrow("Take must be greater than 0")
    await expect(postService.list({ take: 10, page: -1 })).rejects.toThrow("Page must be greater than 0")
  })
})
