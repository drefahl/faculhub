import { ThreadController } from "@/controllers/thread.controller"
import { createThreadService } from "@/factories/serviceFactory"
import { idParametersSchema } from "@/schemas/route.schema"
import { createThreadSchema, updateThreadSchema } from "@/schemas/thread.schema"
import type { FastifyInstance } from "fastify"

const threadController = new ThreadController(createThreadService())

export async function threadRoutes(app: FastifyInstance) {
  app.post("/", { schema: { body: createThreadSchema } }, threadController.create.bind(threadController))

  app.get("/:id", { schema: { params: idParametersSchema } }, threadController.getById.bind(threadController))

  app.patch(
    "/:id",
    { schema: { params: idParametersSchema, body: updateThreadSchema } },
    threadController.update.bind(threadController),
  )

  app.delete("/:id", { schema: { params: idParametersSchema } }, threadController.delete.bind(threadController))
}
