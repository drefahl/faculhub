import { fileStreamToBuffer } from "@/lib/utils/file.utils"
import type { UpdateUserInput } from "@/schemas/user.schema"
import { UserService } from "@/services/user.service"
import type { Prisma } from "@prisma/client"
import type { FastifyReply, FastifyRequest } from "fastify"

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  async createUser(request: FastifyRequest<{ Body: Prisma.userCreateInput }>, reply: FastifyReply) {
    const user = await this.userService.createUser(request.body)

    return reply.code(201).send(user)
  }

  async getUserProfile(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.userService.getUserById(request.user.id)
    if (!user) return reply.code(404).send({ message: "User not found" })

    return reply.send(user)
  }

  async updateUserProfile(request: FastifyRequest<{ Body: UpdateUserInput }>, reply: FastifyReply) {
    const user = await this.userService.updateUser(request.user.id, request.body)

    return reply.send(user)
  }

  async uploadProfileImage(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file()

    if (!data) return reply.code(400).send({ message: "File not found" })
    if (!data.mimetype.startsWith("image/")) return reply.code(400).send({ message: "File is not an image" })
    if (data.file.truncated) return reply.code(400).send({ message: "File is too large" })

    const user = await this.userService.updateUserProfileImage(
      request.user.id,
      data.filename,
      data.mimetype,
      await fileStreamToBuffer(data.file),
    )

    return reply.send(user)
  }

  async deleteProfileImage(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.userService.deleteUserProfileImage(request.user.id)

    return reply.send(user)
  }
}
