import { NotFoundError } from "@/errors/NotFoundError"
import { createPostService } from "@/factories/serviceFactory"
import { prisma } from "@/lib/prisma"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"

const postService = createPostService()

describe("PostService Integration", () => {
  let authorId: number

  beforeEach(async () => {
    await resetDatabase()

    const author = await prisma.user.create({
      data: { name: "Author", email: "author@example.com", password: "123456" },
    })
    authorId = author.id
  })

  it("creates a NEWS post without courses", async () => {
    const post = await postService.create({
      title: "News",
      content: "News body",
      type: "NEWS",
      authorId,
    })

    expect(post.author.id).toBe(authorId)
    expect(post.type).toBe("NEWS")
    expect(post.courses).toEqual([])
  })

  it("creates an EVENT post with date and location", async () => {
    const date = new Date()
    const post = await postService.create({
      title: "Event",
      content: "Details",
      type: "EVENT",
      authorId,
      eventDate: date,
      location: "Room 1",
    })

    expect(post.type).toBe("EVENT")
    expect(post.eventDate?.toISOString()).toBe(date.toISOString())
    expect(post.location).toBe("Room 1")
  })

  it("returns post by id and throws NotFoundError if it does not exist", async () => {
    const saved = await postService.create({
      title: "X",
      content: "Y",
      type: "NEWS",
      authorId,
    })
    const fetched = await postService.getById(saved.id)

    expect(fetched.id).toBe(saved.id)
    await expect(() => postService.getById(0)).rejects.toThrow(NotFoundError)
  })

  it("updates title and disconnects courses correctly", async () => {
    const course = await prisma.course.create({ data: { name: "C1", code: "C" } })

    const original = await postService.create({
      title: "With Category",
      content: "Content",
      type: "NEWS",
      authorId,
      courses: [course.id],
    })

    expect(original.courses?.[0].id).toBe(course.id)

    const updated = await postService.update(original.id, {
      title: "Without Category",
      courses: [],
    })

    expect(updated.title).toBe("Without Category")
    expect(updated.courses).toEqual([])
  })

  it("delete and recordView increment views", async () => {
    const post = await postService.create({
      title: "View",
      content: "Content",
      type: "NEWS",
      authorId,
    })
    const before = post.views
    const after = await postService.recordView(post.id)

    expect(after.views).toBe(before + 1)

    await postService.delete(post.id)
    await expect(() => postService.getById(post.id)).rejects.toThrow(NotFoundError)
  })

  it("list returns pagination, search, and parameter errors", async () => {
    await postService.create({ title: "A", content: "Content", type: "NEWS", authorId })
    await postService.create({ title: "B", content: "Content", type: "NEWS", authorId })

    const result = await postService.list({ page: 1, take: 10 })
    expect(result.data.length).toBe(2)

    const filtered = await postService.list({ page: 1, take: 10, search: "A" })
    expect(filtered.data.length).toBe(1)

    await expect(() => postService.list({ page: 0, take: 10 })).rejects.toThrow("Page must be greater than 0")
    await expect(() => postService.list({ page: 1, take: 0 })).rejects.toThrow("Take must be greater than 0")
  })
})
