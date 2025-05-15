import { NotFoundError } from "@/errors/NotFoundError"
import { createThreadService } from "@/factories/serviceFactory"
import { prisma } from "@/lib/prisma"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"

const threadService = createThreadService()

describe("ThreadService Integration", () => {
  let authorId: number
  const contentMock = "Lorem ipsum dolor sit amet"

  beforeEach(async () => {
    await resetDatabase()

    const author = await prisma.user.create({
      data: { name: "Author", email: "a@a.com", password: "123456" },
    })
    authorId = author.id
  })

  it("creates a thread successfully", async () => {
    const thread = await threadService.create({
      title: "Hello World",
      content: "This is a thread",
      authorId,
    })

    expect(thread.id).toBeDefined()
    expect(thread.title).toBe("Hello World")
    expect(thread.author.id).toBe(authorId)
  })

  it("throws if author does not exist", async () => {
    await expect(threadService.create({ title: "title", content: contentMock, authorId: 999 })).rejects.toThrow(
      NotFoundError,
    )
  })

  it("getById returns thread or null", async () => {
    const t = await threadService.create({ title: "title", content: contentMock, authorId })

    const found = await threadService.getById(t.id)
    expect(found?.id).toBe(t.id)

    const none = await threadService.getById(0)
    expect(none).toBeNull()
  })

  it("updates a thread and throws if not found", async () => {
    const t = await threadService.create({ title: "New Title", content: "Old Content", authorId })

    const updated = await threadService.update(t.id, { title: "Updated Title", content: "New Content" })
    expect(updated.title).toBe("Updated Title")

    await expect(threadService.update(0, { title: "X", content: "Y" })).rejects.toThrow(NotFoundError)
  })

  it("deletes a thread and throws if not found", async () => {
    const t = await threadService.create({ title: "Del", content: contentMock, authorId })

    const deleted = await threadService.delete(t.id)
    expect(deleted.id).toBe(t.id)

    await expect(threadService.getById(t.id)).resolves.toBeNull()
    await expect(threadService.delete(0)).rejects.toThrow(NotFoundError)
  })

  it("lists threads with pagination, search and param validation", async () => {
    await threadService.create({ title: "ABC", content: contentMock, authorId })
    await threadService.create({ title: "DEF", content: contentMock, authorId })

    const res1 = await threadService.list({ page: 1, take: 10 })

    expect(res1.data.length).toBe(2)
    expect(res1.page).toBe(1)
    expect(res1.perPage).toBe(10)

    const res2 = await threadService.list({ page: 1, take: 10, search: "A" })
    expect(res2.data.length).toBe(1)
    expect(res2.data[0].title).toContain("A")

    await expect(threadService.list({ page: 0, take: 10 })).rejects.toThrow("Page must be greater than 0")
    await expect(threadService.list({ page: 1, take: 0 })).rejects.toThrow("Take must be greater than 0")
  })
})
