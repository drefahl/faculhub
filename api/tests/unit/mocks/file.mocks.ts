import { FileRepository } from "@/repositories/file.repository"
import { vi } from "vitest"
import { mockConstants } from "./constants"

export function createFileRepositoryMock(): FileRepository {
  const service = new FileRepository()

  vi.spyOn(service, "createFile").mockImplementation(async (data) => {
    return {
      ...data,
      id: mockConstants.file.id,
      createdAt: new Date(),
    }
  })

  vi.spyOn(service, "getFileById").mockImplementation(async (id) => {
    if (id !== mockConstants.file.id) return null

    return {
      id: mockConstants.file.id,
      filename: mockConstants.file.filename,
      mimeType: mockConstants.file.mimeType,
      data: mockConstants.file.data,
      createdAt: new Date(),
    }
  })

  vi.spyOn(service, "deleteFile").mockImplementation(async (id) => {
    if (id !== mockConstants.file.id) throw new Error("File not found")

    return {
      id: mockConstants.file.id,
      filename: mockConstants.file.filename,
      mimeType: mockConstants.file.mimeType,
      data: mockConstants.file.data,
      createdAt: new Date(),
    }
  })

  return service
}
