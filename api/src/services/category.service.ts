import { NotFoundError } from "@/errors/NotFoundError"
import type { CategoryRepository } from "@/repositories/category.repository"
import {
  type CreateCategoryInput,
  type UpdateCategoryInput,
  createCategorySchema,
  updateCategorySchema,
} from "@/schemas/category.schema"

export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async create(data: CreateCategoryInput) {
    createCategorySchema.parse(data)

    const existing = await this.categoryRepo.getCategoryByName(data.name)
    if (existing) throw new Error("Category name already in use")

    return this.categoryRepo.createCategory({ name: data.name })
  }

  async getById(id: number) {
    const category = await this.categoryRepo.getCategoryById(id)
    if (!category) throw new NotFoundError("Category not found")

    return category
  }

  async list() {
    return this.categoryRepo.listCategories()
  }

  async update(id: number, data: UpdateCategoryInput) {
    updateCategorySchema.parse(data)

    const existingName = await this.categoryRepo.getCategoryByName(data.name!)
    if (existingName && existingName.id !== id) throw new Error("Category name already in use")

    await this.getById(id)

    return this.categoryRepo.updateCategory(id, data)
  }

  async delete(id: number) {
    await this.getById(id)

    await this.categoryRepo.deleteCategory(id)
  }

  async validateCategory(id: number) {
    const category = await this.categoryRepo.getCategoryById(id)
    if (!category) throw new NotFoundError("Category not found")

    return category
  }
}
