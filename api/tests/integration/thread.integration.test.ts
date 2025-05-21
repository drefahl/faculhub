import { NotFoundError } from "@/errors/NotFoundError"
import { createThreadService } from "@/factories/serviceFactory"
import { prisma } from "@/lib/prisma"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"

const threadService = createThreadService()

describe("ThreadService Integration", () => {
  let authorId: number
  let categoryId: number
  const contentMock = "Lorem ipsum dolor sit amet"

  beforeEach(async () => {
    await resetDatabase()

    const createAuthor = prisma.user.create({
      data: { name: "Author", email: "a@a.com", password: "123456" },
    })

    const createCategory = prisma.category.create({
      data: { name: "Category" },
    })

    const [author, category] = await Promise.all([createAuthor, createCategory])

    authorId = author.id
    categoryId = category.id
  })

  it("creates a thread successfully", async () => {
    const thread = await threadService.create({
      title: "Hello World",
      content: "This is a thread",
      authorId,
      categories: [categoryId],
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
    const t = await threadService.create({
      title: "New Title",
      content: "Old Content",
      authorId,
      categories: [categoryId],
    })

    const updated = await threadService.update(t.id, { title: "Updated Title", content: "New Content" })
    expect(updated.title).toBe("Updated Title")

    await expect(threadService.update(0, { title: "X", content: "Y" })).rejects.toThrow(NotFoundError)
  })

  it("throws if categories do not exist", async () => {
    await expect(
      threadService.create({ title: "title", content: contentMock, authorId, categories: [999] }),
    ).rejects.toThrow(NotFoundError)
  })

  it("throws if categories do not exist on update", async () => {
    const t = await threadService.create({ title: "title", content: contentMock, authorId })
    await expect(
      threadService.update(t.id, { title: "title", content: contentMock, categories: [999] }),
    ).rejects.toThrow(NotFoundError)
  })

  it("removes a category from a thread", async () => {
    const t = await threadService.create({
      title: "title",
      content: contentMock,
      authorId,
      categories: [categoryId],
    })

    const updated = await threadService.update(t.id, { categories: [] })
    expect(updated.categories.length).toBe(0)
  })

  it("updates a thread's categories", async () => {
    const c = await prisma.category.create({ data: { name: "Category 2" } })

    const t = await threadService.create({
      title: "title",
      content: contentMock,
      authorId,
      categories: [categoryId, c.id],
    })

    const updated = await threadService.update(t.id, { categories: [categoryId] })
    expect(updated.categories.length).toBe(1)
    expect(updated.categories[0].id).toBe(categoryId)
  })

  it("adds a category to a thread", async () => {
    const t = await threadService.create({ title: "title", content: contentMock, authorId })

    const updated = await threadService.update(t.id, { categories: [categoryId] })
    expect(updated.categories.length).toBe(1)
    expect(updated.categories[0].id).toBe(categoryId)
  })

  it("adds multiple categories to a thread", async () => {
    const t = await threadService.create({ title: "title", content: contentMock, authorId })
    const c = await prisma.category.create({ data: { name: "Category 2" } })

    const updated = await threadService.update(t.id, { categories: [categoryId, c.id] })
    expect(updated.categories.length).toBe(2)
    expect(updated.categories[0].id).toBe(categoryId)
    expect(updated.categories[1].id).toBe(c.id)
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
