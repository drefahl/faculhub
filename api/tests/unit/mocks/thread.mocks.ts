import { NotFoundError } from "@/errors/NotFoundError"
import { ThreadRepository } from "@/repositories/thread.repository"
import type { thread } from "@prisma/client"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createThreadRepositoryMock(): ThreadRepository {
  const repo = new ThreadRepository()

  const threads: Map<number, thread> = new Map([
    [
      mockConstants.thread.id,
      {
        id: mockConstants.thread.id,
        title: "Mocked Thread",
        content: "Mocked Content",
        authorId: mockConstants.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  ])

  vi.spyOn(repo, "createThread").mockImplementation(async (data) => {
    const id = Math.floor(Math.random() * 1000)
    const newThread: thread = {
      id,
      authorId: data?.author?.connect?.id ?? mockConstants.user.id,
      title: data.title,
      content: data.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    threads.set(id, newThread)
    return newThread
  })

  vi.spyOn(repo, "getThreadById").mockImplementation(async (id) => {
    return threads.get(id) ?? null
  })

  vi.spyOn(repo, "updateThread").mockImplementation(async (id, data) => {
    const existingThread = threads.get(id)
    if (!existingThread) throw new NotFoundError("Thread not found")

    const updatedThread: thread = {
      ...existingThread,
      title: typeof data?.title === "string" ? data.title : existingThread.title,
      content: typeof data?.content === "string" ? data.content : existingThread.content,
      authorId: data?.author?.connect?.id ?? existingThread.authorId,
      updatedAt: new Date(),
    }

    threads.set(id, updatedThread)
    return updatedThread
  })

  vi.spyOn(repo, "deleteThread").mockImplementation(async (id) => {
    const thread = threads.get(id)
    if (!thread) throw new NotFoundError("Thread not found")

    threads.delete(id)
    return thread
  })

  return repo
}
