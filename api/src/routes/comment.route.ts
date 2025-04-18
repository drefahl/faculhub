import { CommentController } from "@/controllers/comment.controller"
import { createCommentService } from "@/factories/serviceFactory"
import { createCommentSchema, updateCommentSchema } from "@/schemas/comment.schema"
import { routeIdParametersSchema } from "@/schemas/route.schema"
import type { FastifyInstance } from "fastify"
import z from "zod"

export async function commentRoutes(app: FastifyInstance) {
  const commentController = new CommentController(createCommentService(), app)

  app.post(
    "/",
    {
      schema: {
        tags: ["Comment"],
        operationId: "createComment",
        body: createCommentSchema,
      },
    },
    commentController.create.bind(commentController),
  )

  app.patch(
    "/:id",
    {
      schema: {
        tags: ["Comment"],
        operationId: "updateComment",
        params: routeIdParametersSchema,
        body: updateCommentSchema,
      },
    },
    commentController.update.bind(commentController),
  )

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Comment"],
        operationId: "deleteComment",
        params: routeIdParametersSchema,
      },
    },
    commentController.delete.bind(commentController),
  )
}

export async function commentPublicRoutes(app: FastifyInstance) {
  const commentController = new CommentController(createCommentService(), app)

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Comment"],
        operationId: "getCommentById",

        params: routeIdParametersSchema,
      },
    },
    commentController.getById.bind(commentController),
  )
}

export const commentListSchema = z.array(
  z.object({
    id: z.number(),
    content: z.string(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
    author: z.object({
      id: z.number(),
      name: z.string(),
      profilePicId: z.number().nullable(),
    }),
  }),
)
