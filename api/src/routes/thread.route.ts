import { ThreadController } from "@/controllers/thread.controller"
import { createThreadService } from "@/factories/serviceFactory"
import { routeIdParametersSchema } from "@/schemas/route.schema"
import type { FastifyInstance } from "fastify"
import z from "zod"

export async function threadRoutes(app: FastifyInstance) {
  const threadController = new ThreadController(createThreadService(), app)

  app.post(
    "/",
    {
      schema: {
        tags: ["Thread"],
        operationId: "createThread",
        body: z.object({
          title: z.string().nonempty().min(2, { message: "Title is required" }),
          content: z.string().nonempty().min(2, { message: "Content is required" }),
          categories: z.array(z.number().int().positive()).optional(),
        }),
        response: {
          200: threadSchema,
        },
      },
    },
    threadController.create.bind(threadController),
  )

  app.patch(
    "/:id",
    {
      schema: {
        tags: ["Thread"],
        operationId: "updateThread",
        params: routeIdParametersSchema,
        body: z.object({
          title: z.string().optional(),
          content: z.string().optional(),
          categories: z.array(z.number().int().positive()).optional(),
        }),
        response: {
          200: threadSchema,
        },
      },
    },
    threadController.update.bind(threadController),
  )

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Thread"],
        operationId: "deleteThread",
        params: routeIdParametersSchema,
        response: {
          200: threadSchema,
        },
      },
    },
    threadController.delete.bind(threadController),
  )
}

export async function threadPublicRoutes(app: FastifyInstance) {
  const threadController = new ThreadController(createThreadService(), app)

  app.get(
    "/",
    {
      schema: {
        tags: ["Thread"],
        operationId: "listThreads",
        querystring: z.object({
          page: z.coerce.number(),
          take: z.coerce.number(),
          search: z.string().optional(),
          categoryId: z.coerce.number().optional(),
        }),
        response: {
          200: threadResponseArraySchema,
        },
      },
    },
    threadController.list.bind(threadController),
  )

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Thread"],
        operationId: "getThreadById",
        params: routeIdParametersSchema,
        response: {
          200: threadSchema,
        },
      },
    },
    threadController.getById.bind(threadController),
  )
}

export const threadSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  author: z.object({
    id: z.number(),
    name: z.string(),
    profilePicId: z.string().nullable(),
  }),
  comments: z.array(
    z.object({
      id: z.number(),
      content: z.string(),
      createdAt: z.union([z.string(), z.date()]),
      author: z.object({
        id: z.number(),
        name: z.string(),
        profilePicId: z.string().nullable(),
      }),
    }),
  ),
  categories: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
})

export const threadResponseArraySchema = z.object({
  data: z.array(threadSchema),
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
})
