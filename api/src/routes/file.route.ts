import { FileController } from "@/controllers/file.controller"
import { createFileService } from "@/factories/serviceFactory"
import type { FastifyInstance } from "fastify"
import z from "zod"

const fileController = new FileController(createFileService())

export async function filePublicRoutes(app: FastifyInstance) {
  app.get(
    "/:id",
    {
      schema: {
        tags: ["File"],
        operationId: "getFileById",
        params: z.object({ id: z.string() }),
      },
    },
    fileController.getFileById.bind(fileController),
  )
}
