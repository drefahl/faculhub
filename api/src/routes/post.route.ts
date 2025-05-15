import { PostController } from "@/controllers/post.controller"
import { createPostService } from "@/factories/serviceFactory"
import { createPostSchema, postResponseArraySchema, postSchema, updatePostSchema } from "@/schemas/post.schema"
import { routeIdParametersSchema } from "@/schemas/route.schema"
import type { FastifyInstance } from "fastify"
import z from "zod"

const postController = new PostController(createPostService())

export async function postRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["Post"],
        operationId: "createPost",
        body: createPostSchema.innerType().omit({ authorId: true }),
        response: {
          201: postSchema,
        },
      },
    },
    postController.create.bind(postController),
  )

  app.patch(
    "/:id",
    {
      schema: {
        tags: ["Post"],
        operationId: "updatePost",
        params: routeIdParametersSchema,
        body: updatePostSchema,
        response: { 200: postSchema },
      },
    },
    postController.update.bind(postController),
  )

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Post"],
        operationId: "deletePost",
        params: routeIdParametersSchema,
        response: { 200: postSchema },
      },
    },
    postController.delete.bind(postController),
  )
}

export async function postPublicRoutes(app: FastifyInstance) {
  app.patch(
    "/:id/view",
    {
      schema: {
        tags: ["Post"],
        operationId: "recordPostView",
        params: routeIdParametersSchema,
        response: { 200: postSchema },
      },
    },
    postController.recordView.bind(postController),
  )

  app.get(
    "/",
    {
      schema: {
        tags: ["Post"],
        operationId: "listPosts",
        querystring: z.object({
          page: z.coerce.number(),
          take: z.coerce.number(),
          search: z.string().optional(),
          course: z.coerce.number().optional(),
          type: z.enum(["EVENT", "NEWS"]).optional(),
        }),
        response: {
          200: postResponseArraySchema,
        },
      },
    },
    postController.list.bind(postController),
  )

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Post"],
        operationId: "getPostById",
        params: routeIdParametersSchema,
        response: { 200: postSchema },
      },
    },
    postController.getById.bind(postController),
  )
}
