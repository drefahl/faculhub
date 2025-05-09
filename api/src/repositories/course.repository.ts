import { prisma } from "@/lib/prisma"
import type { CreateCourseInput, UpdateCourseInput } from "@/schemas/course.schema"

export class CourseRepository {
  async create(data: CreateCourseInput) {
    return prisma.course.create({ data })
  }

  async findAll() {
    return prisma.course.findMany()
  }

  async findById(id: number) {
    return prisma.course.findUnique({ where: { id } })
  }

  async update(id: number, data: UpdateCourseInput) {
    return prisma.course.update({ where: { id }, data })
  }

  async delete(id: number) {
    return prisma.course.delete({ where: { id } })
  }
}
