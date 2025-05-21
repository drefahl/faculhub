import type { CreateCategoryInput, UpdateCategoryInput } from "@/schemas/category.schema"
import type { CategoryService } from "@/services/category.service"
import type { FastifyReply, FastifyRequest } from "fastify"

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  async create(request: FastifyRequest<{ Body: CreateCategoryInput }>, reply: FastifyReply) {
    const category = await this.categoryService.create(request.body)
    return reply.code(201).send(category)
  }

  async list(_request: FastifyRequest, reply: FastifyReply) {
    const categories = await this.categoryService.list()
    return reply.send(categories)
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const category = await this.categoryService.getById(+request.params.id)
    if (!category) return reply.code(404).send({ message: "Not found" })
    return reply.send(category)
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: UpdateCategoryInput }>, reply: FastifyReply) {
    const updated = await this.categoryService.update(+request.params.id, request.body)
    return reply.send(updated)
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    await this.categoryService.delete(+request.params.id)
    return reply.send({ success: true })
  }
}
