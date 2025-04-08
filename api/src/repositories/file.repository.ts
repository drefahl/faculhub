import { prisma } from "@/lib/prisma"
import type { file as FileModel } from "@prisma/client"

export class FileRepository {
  async createFile(data: { filename: string; mimeType: string; data: Buffer }): Promise<FileModel> {
    return prisma.file.create({
      data: {
        filename: data.filename,
        mimeType: data.mimeType,
        data: data.data,
      },
    })
  }

  async getFileById(id: string): Promise<FileModel | null> {
    return prisma.file.findUnique({ where: { id } })
  }

  async deleteFile(id: string): Promise<FileModel> {
    return prisma.file.delete({ where: { id } })
  }
}
