import { createCourseService } from "@/factories/serviceFactory"
import type { FastifyInstance } from "fastify"
import z from "zod"
import { CourseController } from "../controllers/course.controller"

const controller = new CourseController(createCourseService())

export async function courseRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["Course"],
        operationId: "createCourse",
        body: z.object({
          name: z.string(),
          code: z.string(),
          description: z.string(),
        }),
        response: { 201: z.object({ id: z.number(), code: z.string() }) },
      },
    },
    controller.create.bind(controller),
  )

  app.patch(
    "/:id",
    {
      schema: {
        tags: ["Course"],
        operationId: "updateCourse",
        params: z.object({ id: z.coerce.number() }),
      },
    },
    controller.update.bind(controller),
  )

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Course"],
        operationId: "deleteCourse",
        params: z.object({ id: z.coerce.number() }),
      },
    },
    controller.delete.bind(controller),
  )
}

export async function coursePublicRoutes(app: FastifyInstance) {
  app.get(
    "/",
    {
      schema: {
        tags: ["Course"],
        operationId: "listCourses",
        response: { 200: z.array(z.object({ id: z.number(), code: z.string() })) },
      },
    },
    controller.list.bind(controller),
  )

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Course"],
        operationId: "getCourseById",
        params: z.object({ id: z.coerce.number() }),
      },
    },
    controller.getById.bind(controller),
  )
}
