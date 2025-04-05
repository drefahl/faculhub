import { UserController } from "@/controllers/user.controller"
import { ResponseGetUserSchema, createUserSchema, updateUserSchema } from "@/schemas/user.schema"
import { UserService } from "@/services/user.service"
import type { FastifyInstance } from "fastify"
import z from "zod"

const userService = new UserService()
const userController = new UserController(userService)

export async function userRoutes(app: FastifyInstance) {
  app.get(
    "/me",
    {
      schema: {
        tags: ["User"],
        operationId: "getUserProfile",
        description: "Get user profile",
        response: {
          200: ResponseGetUserSchema,
        },
      },
    },
    userController.getUserProfile.bind(userController),
  )

  app.patch(
    "/me",
    {
      schema: {
        tags: ["User"],
        operationId: "updateUserProfile",
        description: "Update user profile",
        body: updateUserSchema,
        response: {
          200: ResponseGetUserSchema,
        },
      },
    },
    userController.updateUserProfile.bind(userController),
  )
}

export async function userPublicRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      schema: {
        tags: ["User"],
        operationId: "createUser",
        description: "Create a new user",
        body: createUserSchema,
        response: {
          201: ResponseGetUserSchema,
        },
      },
    },
    userController.createUser.bind(userController),
  )

  app.put(
    "/profile-image",
    {
      schema: {
        tags: ["User"],
        operationId: "uploadProfileImage",
        description: "Upload a profile image",
        consumes: ["multipart/form-data"],
        response: {
          200: ResponseGetUserSchema,
          400: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    userController.uploadProfileImage.bind(userController),
  )

  app.delete(
    "/profile-image",
    {
      schema: {
        tags: ["User"],
        operationId: "deleteProfileImage",
        description: "Delete a profile image",
        response: {
          200: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    userController.deleteProfileImage.bind(userController),
  )
}
