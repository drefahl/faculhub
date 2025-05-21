import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

export class CategoryRepository {
  async createCategory(data: Prisma.categoryCreateInput) {
    return prisma.category.create({ data })
  }

  async getCategoryById(id: number) {
    return prisma.category.findUnique({ where: { id } })
  }

  async listCategories() {
    return prisma.category.findMany()
  }

  async updateCategory(id: number, data: Prisma.categoryUpdateInput) {
    return prisma.category.update({ where: { id }, data })
  }

  async deleteCategory(id: number) {
    return prisma.category.delete({ where: { id } })
  }

  async getCategoryByName(name: string) {
    return prisma.category.findUnique({ where: { name } })
  }
}
