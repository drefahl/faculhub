import { NotFoundError } from "@/errors/NotFoundError"
import {
  type CreateCourseInput,
  type UpdateCourseInput,
  createCourseSchema,
  updateCourseSchema,
} from "@/schemas/course.schema"
import type { CourseRepository } from "../repositories/course.repository"

export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  async createCourse(data: CreateCourseInput) {
    createCourseSchema.parse(data)

    return this.courseRepository.create(data)
  }

  async listCourses() {
    return this.courseRepository.findAll()
  }

  async getCourseById(id: number) {
    const course = await this.courseRepository.findById(id)
    if (!course) throw new NotFoundError("Course not found")

    return course
  }

  async updateCourse(id: number, data: UpdateCourseInput) {
    updateCourseSchema.parse(data)

    const existing = await this.courseRepository.findById(id)
    if (!existing) throw new NotFoundError("Course not found")

    return this.courseRepository.update(id, data)
  }

  async deleteCourse(id: number) {
    const existing = await this.courseRepository.findById(id)
    if (!existing) throw new NotFoundError("Course not found")

    return this.courseRepository.delete(id)
  }
}
