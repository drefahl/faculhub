import { ThreadRepository } from "@/repositories/thread.repository"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createThreadRepositoryMock(): ThreadRepository {
  const repo = new ThreadRepository()

  vi.spyOn(repo, "createThread").mockImplementation(async (data) => {
    return {
      id: mockConstants.thread.id,
      authorId: data?.author?.connect?.id ?? mockConstants.thread.authorId,
      title: data.title,
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(repo, "getThreadById").mockImplementation(async (id) => {
    if (id !== mockConstants.thread.id) return null

    return {
      id,
      title: "Mocked Thread",
      content: "Mocked Content",
      authorId: mockConstants.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(repo, "updateThread").mockImplementation(async (id, data) => {
    if (id !== mockConstants.thread.id) throw new Error("Thread not found")

    return {
      id: mockConstants.thread.id,
      authorId: data?.author?.connect?.id ?? mockConstants.thread.authorId,
      title: typeof data?.title === "string" ? data.title : mockConstants.thread.title,
      content: typeof data?.content === "string" ? data.content : mockConstants.thread.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  vi.spyOn(repo, "deleteThread").mockImplementation(async (id) => {
    if (id !== mockConstants.thread.id) throw new Error("Thread not found")

    return {
      id,
      title: "Mocked Thread",
      content: "Mocked Content",
      authorId: mockConstants.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  })

  return repo
}
