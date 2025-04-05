import path from "node:path"
import type { UpdateUserInput } from "@/schemas/user.schema"
import type { UserService } from "@/services/user.service"
import type { Prisma } from "@prisma/client"
import type { FastifyReply, FastifyRequest } from "fastify"
import { deleteFileFromDisk, saveFileToDisk } from "./file.utils"

export class UserController {
  constructor(private readonly userService: UserService) {}

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

    const uploadDir = path.join(__dirname, "../../public/uploads")
    try {
      await saveFileToDisk(data.file, data.filename, uploadDir)
    } catch (error) {
      return reply.code(500).send({ message: "Failed to save file" })
    }

    const publicPath = `/uploads/${data.filename}`

    const user = await this.userService.updateUser(request.user.id, { picture: publicPath })

    return reply.send(user)
  }

  async deleteProfileImage(request: FastifyRequest, reply: FastifyReply) {
    const user = await this.userService.getUserById(request.user.id)
    if (!user) return reply.code(404).send({ message: "User not found" })

    if (!user.picture) return reply.code(400).send({ message: "No profile image to delete" })

    const uploadDir = path.join(__dirname, "../../public/uploads")
    const filePath = path.join(uploadDir, user.picture)

    try {
      await deleteFileFromDisk(filePath)
    } catch (error) {
      return reply.code(500).send({ message: "Failed to delete file" })
    }

    const updatedUser = await this.userService.updateUser(request.user.id, { picture: null })

    return reply.send(updatedUser)
  }
}
