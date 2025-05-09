import { LikeController } from "@/controllers/like.controller"
import { createLikeService } from "@/factories/serviceFactory"
import {
  countLikesResponseSchema,
  likeParamsSchema,
  likeResponseSchema,
  unlikeResponseSchema,
} from "@/schemas/like.schema"
import type { FastifyInstance } from "fastify"

export async function likeRoutes(app: FastifyInstance) {
  const likeController = new LikeController(createLikeService())

  app.post(
    "/:postId",
    {
      schema: {
        tags: ["Like"],
        operationId: "likePost",
        params: likeParamsSchema,
        response: {
          201: likeResponseSchema,
        },
      },
    },
    likeController.likePost.bind(likeController),
  )

  app.delete(
    "/:postId",
    {
      schema: {
        tags: ["Like"],
        operationId: "unlikePost",
        params: likeParamsSchema,
        response: {
          200: unlikeResponseSchema,
        },
      },
    },
    likeController.unlikePost.bind(likeController),
  )
}

export async function likePublicRoutes(app: FastifyInstance) {
  const likeController = new LikeController(createLikeService())

  app.get(
    "/:postId/count",
    {
      schema: {
        tags: ["Like"],
        operationId: "countLikes",
        params: likeParamsSchema,
        response: {
          200: countLikesResponseSchema,
        },
      },
    },
    likeController.countLikes.bind(likeController),
  )
}
