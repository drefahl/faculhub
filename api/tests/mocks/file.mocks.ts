import { FileRepository } from "@/repositories/file.repository"
import { FileService } from "@/services/file.service"
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

export function createFileServiceMock(fileRepository: FileRepository): FileService {
  const service = new FileService(fileRepository)

  vi.spyOn(service, "createFile").mockImplementation(async (filename: string, mimeType: string, data: Buffer) => {
    return {
      id: mockConstants.file.id,
      filename,
      mimeType,
      data,
      createdAt: new Date(),
    }
  })

  vi.spyOn(service, "getFileById").mockImplementation(async (id: string) => {
    if (id !== mockConstants.file.id) return null

    return {
      id: mockConstants.file.id,
      filename: mockConstants.file.filename,
      mimeType: mockConstants.file.mimeType,
      data: mockConstants.file.data,
      createdAt: new Date(),
    }
  })

  vi.spyOn(service, "deleteFile").mockImplementation(async (id: string) => {
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
