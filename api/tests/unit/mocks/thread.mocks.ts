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

    return {
      ...newThread,
      author: {
        id: newThread.authorId,
        name: mockConstants.user.name,
        profilePicId: null,
      },
      comments: [],
    }
  })

  vi.spyOn(repo, "getThreadById").mockImplementation(async (id) => {
    const thread = threads.get(id)
    if (!thread) return null

    return {
      ...thread,
      author: {
        id: thread.authorId,
        name: mockConstants.user.name,
        profilePicId: null,
      },
      comments: [],
    }
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

    return {
      ...updatedThread,
      author: {
        id: updatedThread.authorId,
        name: mockConstants.user.name,
        profilePicId: null,
      },
      comments: [],
    }
  })

  vi.spyOn(repo, "deleteThread").mockImplementation(async (id) => {
    const thread = threads.get(id)
    if (!thread) throw new NotFoundError("Thread not found")

    threads.delete(id)

    return {
      ...thread,
      author: {
        id: thread.authorId,
        name: mockConstants.user.name,
        profilePicId: null,
      },
      comments: [],
    }
  })

  vi.spyOn(repo, "listThreads").mockImplementation(async ({ take, skip, search }) => {
    const allThreads = Array.from(threads.values())

    const filteredThreads = search
      ? allThreads.filter((thread) => thread.title.toLowerCase().includes(search.toLowerCase()))
      : allThreads

    const paginatedThreads = filteredThreads.slice(skip, skip + take)

    const data = paginatedThreads.map((thread) => ({
      ...thread,
      author: {
        id: thread.authorId,
        name: mockConstants.user.name,
        profilePicId: null,
      },
      comments: [],
    }))

    const total = filteredThreads.length

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

  return repo
}
