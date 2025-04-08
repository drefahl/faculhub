import { FileService } from "@/services/file.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class FileController {
  constructor(private readonly fileService: FileService = new FileService()) {}

  async getFileById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const file = await this.fileService.getFileById(request.params.id)
    if (!file) return reply.code(404).send({ message: "File not found" })

    reply.type(file.mimeType).send(file.data)
  }
}
