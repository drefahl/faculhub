import { CommentController } from "@/controllers/comment.controller"
import { createCommentService } from "@/factories/serviceFactory"
import { createCommentSchema, updateCommentSchema } from "@/schemas/comment.schema"
import { routeIdParametersSchema } from "@/schemas/route.schema"
import type { FastifyInstance } from "fastify"

const commentController = new CommentController(createCommentService())

export async function commentRoutes(app: FastifyInstance) {
  app.post("/", { schema: { body: createCommentSchema } }, commentController.create.bind(commentController))

  app.get("/:id", { schema: { params: routeIdParametersSchema } }, commentController.getById.bind(commentController))

  app.patch(
    "/:id",
    {
      schema: {
        params: routeIdParametersSchema,
        body: updateCommentSchema,
      },
    },
    commentController.update.bind(commentController),
  )

  app.delete("/:id", { schema: { params: routeIdParametersSchema } }, commentController.delete.bind(commentController))
}
