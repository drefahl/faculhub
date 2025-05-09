import { NotFoundError } from "@/errors/NotFoundError"
import { PostRepository } from "@/repositories/post.repository"
import type { post } from "@prisma/client"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createPostRepositoryMock(): PostRepository {
  const repo = new PostRepository()
  const posts: Map<number, post> = new Map([
    [
      mockConstants.post.id,
      {
        ...(mockConstants.post as post),
        courseId: mockConstants.course.id,
      },
    ],
  ])

  vi.spyOn(repo, "createPost").mockImplementation(async (data) => {
    const id = Date.now()
    const newPost: post = {
      id,
      title: data.title,
      content: data.content,
      type: data.type,
      isPinned: data.isPinned ?? false,
      eventDate: data.eventDate instanceof Date ? data.eventDate : null,
      location: data.location ?? null,
      authorId: data.author?.connect?.id ?? mockConstants.user.id,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    posts.set(id, newPost)

    return {
      ...newPost,
      author: {
        id: newPost.authorId,
        name: mockConstants.user.name,
        profilePicId: mockConstants.user.profilePicId,
      },
      categories: [],
      comments: [],
      likes: [],
      courses: [],
      _count: { likes: 0 },
    }
  })

  vi.spyOn(repo, "getPostById").mockImplementation(async (id) => {
    const p = posts.get(id)
    if (!p) return null

    return {
      ...p,
      author: {
        id: p.authorId,
        name: mockConstants.user.name,
        profilePicId: mockConstants.user.profilePicId,
      },
      categories: [],
      comments: [],
      likes: [],
      courses: [],
      _count: { likes: 0 },
    }
  })

  vi.spyOn(repo, "updatePost").mockImplementation(async (id, data) => {
    const existing = posts.get(id)
    if (!existing) throw new NotFoundError("Post not found")

    const updated: post = {
      ...existing,
      title: typeof data?.title === "string" ? data.title : existing.title,
      content: typeof data?.content === "string" ? data.content : existing.content,
      type: typeof data?.type === "string" ? data.type : existing.type,
      isPinned: typeof data?.isPinned === "boolean" ? data.isPinned : existing.isPinned,
      eventDate: data?.eventDate instanceof Date ? data.eventDate : existing.eventDate,
      location: typeof data?.location === "string" ? data.location : existing.location,
      updatedAt: new Date(),
    }

    posts.set(id, updated)

    return {
      ...updated,
      author: {
        id: updated.authorId,
        name: mockConstants.user.name,
        profilePicId: mockConstants.user.profilePicId,
      },
      categories: [],
      comments: [],
      likes: [],
      courses: [],
      _count: { likes: 0 },
    }
  })

  vi.spyOn(repo, "deletePost").mockImplementation(async (id) => {
    const p = posts.get(id)
    if (!p) throw new NotFoundError("Post not found")
    posts.delete(id)

    return {
      ...p,
      author: {
        id: p.authorId,
        name: mockConstants.user.name,
        profilePicId: mockConstants.user.profilePicId,
      },
      categories: [],
      comments: [],
      likes: [],
      courses: [],
      _count: { likes: 0 },
    }
  })

  vi.spyOn(repo, "listPosts").mockImplementation(async ({ take, skip, search }) => {
    let all = Array.from(posts.values())
    if (search) all = all.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))
    const slice = all.slice(skip, skip + take)

    const data = slice.map((p) => ({
      ...p,
      author: { id: p.authorId, name: mockConstants.user.name, profilePicId: mockConstants.user.profilePicId },
      categories: [],
      comments: [],
      likes: [],
      courses: [],
      _count: { likes: 0 },
    }))

    const total = slice.length

    const page = Math.floor(skip / take) + 1
    const totalPages = Math.ceil(total / take)

    return {
      data,
      total,
      page,
      perPage: take,
      totalPages,
    }
  })

  vi.spyOn(repo, "incrementViews").mockImplementation(async (id) => {
    const p = posts.get(id)
    if (!p) throw new NotFoundError("Post not found")

    const updated = { ...p, views: p.views + 1 }
    posts.set(id, updated)

    return {
      ...updated,
      author: { id: updated.authorId, name: mockConstants.user.name, profilePicId: mockConstants.user.profilePicId },
      categories: [],
      comments: [],
      likes: [],
      courses: [],
      _count: { likes: 0 },
    }
  })

  return repo
}
