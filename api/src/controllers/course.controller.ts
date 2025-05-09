import type { CreateCourseInput, UpdateCourseInput } from "@/schemas/course.schema"
import type { FastifyReply, FastifyRequest } from "fastify"
import type { CourseService } from "../services/course.service"

export class CourseController {
  constructor(private courseService: CourseService) {}

  async create(request: FastifyRequest<{ Body: CreateCourseInput }>, reply: FastifyReply) {
    const data = request.body
    const course = await this.courseService.createCourse(data)

    return reply.status(201).send(course)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const courses = await this.courseService.listCourses()

    return reply.send(courses)
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const course = await this.courseService.getCourseById(request.params.id)

    return reply.send(course)
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: UpdateCourseInput }>, reply: FastifyReply) {
    const data = request.body
    const updated = await this.courseService.updateCourse(request.params.id, data)

    return reply.send(updated)
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    await this.courseService.deleteCourse(request.params.id)

    return reply.code(204).send()
  }
}
