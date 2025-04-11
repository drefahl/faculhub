import { NotFoundError } from "@/errors/NotFoundError"
import type { FileRepository } from "@/repositories/file.repository"
import type { file as FileModel } from "@prisma/client"

export class FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async createFile(filename: string, mimeType: string, data: Buffer): Promise<FileModel> {
    return this.fileRepository.createFile({ filename, mimeType, data })
  }

  async getFileById(id: string): Promise<FileModel | null> {
    return this.fileRepository.getFileById(id)
  }

  async deleteFile(id: string): Promise<FileModel> {
    const file = await this.fileRepository.getFileById(id)
    if (!file) throw new NotFoundError("File not found")

    return this.fileRepository.deleteFile(id)
  }
}
