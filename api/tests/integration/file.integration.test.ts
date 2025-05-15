import { NotFoundError } from "@/errors/NotFoundError"
import { createFileService } from "@/factories/serviceFactory"
import type { FileService } from "@/services/file.service"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"

describe("FileService Integration", () => {
  let fileService: FileService

  beforeEach(async () => {
    await resetDatabase()

    fileService = createFileService()
  })

  it("creates and retrieves a file successfully", async () => {
    const payload = {
      filename: "test.jpg",
      mimeType: "image/jpeg",
      data: Buffer.from("imagedata"),
    }

    const created = await fileService.createFile(payload.filename, payload.mimeType, payload.data)

    expect(created.id).toBeDefined()
    expect(created.filename).toBe(payload.filename)
    expect(created.mimeType).toBe(payload.mimeType)
    expect(Buffer.from(created.data)).toEqual(payload.data)

    const fetched = await fileService.getFileById(created.id)
    expect({ ...fetched, data: Buffer.from(fetched!.data) }).toEqual({ ...created, data: Buffer.from(created.data) })
  })

  it("returns null when retrieving non-existent file", async () => {
    const result = await fileService.getFileById("nonexistent-id")
    expect(result).toBeNull()
  })

  it("deletes a file successfully", async () => {
    const payload = { filename: "del.png", mimeType: "image/png", data: Buffer.from("img") }
    const file = await fileService.createFile(payload.filename, payload.mimeType, payload.data)

    const deleted = await fileService.deleteFile(file.id)
    expect(deleted).toEqual(file)

    const after = await fileService.getFileById(file.id)
    expect(after).toBeNull()
  })

  it("throws NotFoundError when deleting non-existent file", async () => {
    await expect(() => fileService.deleteFile("invalid-id")).rejects.toBeInstanceOf(NotFoundError)
  })
})
