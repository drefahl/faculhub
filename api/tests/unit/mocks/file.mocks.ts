import { NotFoundError } from "@/errors/NotFoundError"
import { FileRepository } from "@/repositories/file.repository"
import type { file } from "@prisma/client"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createFileRepositoryMock(): FileRepository {
  const repo = new FileRepository()

  const files: Map<string, file> = new Map([
    [
      mockConstants.file.id,
      {
        id: mockConstants.file.id,
        filename: mockConstants.file.filename,
        mimeType: mockConstants.file.mimeType,
        data: mockConstants.file.data,
        createdAt: new Date(),
        associatedUserIds: new Set([mockConstants.user.id]),
      },
    ],
  ])

  vi.spyOn(repo, "createFile").mockImplementation(async (data) => {
    const id = `file-${Date.now()}`
    const newFile: file = {
      id,
      filename: data.filename,
      mimeType: data.mimeType,
      data: data.data,
      createdAt: new Date(),
    }
    files.set(id, newFile)
    return newFile
  })

  vi.spyOn(repo, "getFileById").mockImplementation(async (id) => {
    return files.get(id) ?? null
  })

  vi.spyOn(repo, "deleteFile").mockImplementation(async (id) => {
    const file = files.get(id)
    if (!file) throw new NotFoundError("File not found")

    files.delete(id)
    return file
  })

  return repo
}
