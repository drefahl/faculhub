import { NotFoundError } from "@/errors/NotFoundError"
import type { FileService } from "@/services/file.service"
import { beforeEach, describe, expect, it } from "vitest"
import { createMockServices } from "./mocks/factories"

describe("File Service Unit Tests", () => {
  let fileService: FileService

  beforeEach(() => {
    fileService = createMockServices().fileService
  })

  describe("File Creation", () => {
    it("should create a new file", async () => {
      const fileData = {
        filename: "test.jpg",
        mimeType: "image/jpeg",
        data: Buffer.from("test image data"),
      }

      const file = await fileService.createFile(fileData.filename, fileData.mimeType, fileData.data)

      expect(file).toHaveProperty("id")
      expect(file.filename).toEqual(fileData.filename)
      expect(file.mimeType).toEqual(fileData.mimeType)
      expect(file.data).toEqual(fileData.data)
    })

    it("should create a file with empty data", async () => {
      const fileData = {
        filename: "empty.txt",
        mimeType: "text/plain",
        data: Buffer.from(""),
      }

      const file = await fileService.createFile(fileData.filename, fileData.mimeType, fileData.data)

      expect(file).toHaveProperty("id")
      expect(file.data.byteLength).toBe(0)
    })
  })

  describe("File Retrieval", () => {
    it("should get a file by id", async () => {
      const mockFile = {
        filename: "existing.pdf",
        mimeType: "application/pdf",
        data: Buffer.from("pdf data"),
        createdAt: new Date(),
      }

      const response = await fileService.createFile(mockFile.filename, mockFile.mimeType, mockFile.data)

      const file = await fileService.getFileById(response.id)

      expect(file).toEqual(response)
    })

    it("should return null for non-existent file id", async () => {
      const file = await fileService.getFileById("nonexistent")

      expect(file).toBeNull()
    })
  })

  describe("File Deletion", () => {
    it("should delete a file", async () => {
      const mockFile = {
        filename: "delete.png",
        mimeType: "image/png",
        data: Buffer.from("png data"),
        createdAt: new Date(),
      }

      const response = await fileService.createFile(mockFile.filename, mockFile.mimeType, mockFile.data)

      const deletedFile = await fileService.deleteFile(response.id)

      expect(deletedFile).toEqual(response)
    })

    it("should throw error when deleting non-existent file", async () => {
      await expect(fileService.deleteFile("nonexistent")).rejects.toThrow(NotFoundError)
      await expect(fileService.deleteFile("nonexistent")).rejects.toThrow("File not found")
    })
  })
})
