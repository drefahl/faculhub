import { FileController } from "@/controllers/file.controller"
import type { FastifyInstance } from "fastify"
import z from "zod"

const fileController = new FileController()

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
