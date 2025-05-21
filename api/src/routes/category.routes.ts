import { CategoryController } from "@/controllers/category.controller"
import { createCategoryService } from "@/factories/serviceFactory"
import type { FastifyInstance } from "fastify"
import z from "zod"

const controller = new CategoryController(createCategoryService())

export async function categoryRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["Category"],
        operationId: "createCategory",
        body: z.object({ name: z.string() }),
      },
    },
    controller.create.bind(controller),
  )

  app.put(
    "/:id",
    {
      schema: {
        tags: ["Category"],
        operationId: "updateCategory",
        params: z.object({ id: z.coerce.number() }),
        body: z.object({ name: z.string() }),
        response: {
          200: z.object({ id: z.number(), name: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.update.bind(controller),
  )

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Category"],
        operationId: "deleteCategory",
        params: z.object({ id: z.coerce.number() }),
        response: {
          200: z.object({ success: z.boolean() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.delete.bind(controller),
  )
}

export async function categoryPublicRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        tags: ["Category"],
        operationId: "listCategories",
        response: {
          200: z.array(z.object({ id: z.number(), name: z.string() })),
        },
      },
    },
    controller.list.bind(controller),
  )

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Category"],
        operationId: "getCategoryById",
        params: z.object({ id: z.coerce.number() }),
        response: {
          200: z.object({ id: z.number(), name: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    controller.getById.bind(controller),
  )
}
