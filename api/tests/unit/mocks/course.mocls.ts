import { NotFoundError } from "@/errors/NotFoundError"
import { CourseRepository } from "@/repositories/course.repository"
import type { course } from "@prisma/client"
import { vi } from "vitest"

export function createCourseRepositoryMock(): CourseRepository {
  const repo = new CourseRepository()
  const courses = new Map<number, course>([])

  vi.spyOn(repo, "create").mockImplementation(async (data) => {
    const id = Math.floor(Math.random() * 1000) + 2
    const newCourse: course = {
      id,
      name: data.name,
      code: data.code,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    courses.set(id, newCourse)

    return newCourse
  })

  vi.spyOn(repo, "findById").mockImplementation(async (id) => {
    const course = courses.get(id)
    if (!course) return null

    return course
  })

  vi.spyOn(repo, "findAll").mockImplementation(async () => {
    return Array.from(courses.values())
  })

  vi.spyOn(repo, "update").mockImplementation(async (id, data) => {
    const existing = courses.get(id)
    if (!existing) throw new NotFoundError("Course not found")
    const updated = { ...existing, ...data }
    courses.set(id, updated)

    return updated
  })

  vi.spyOn(repo, "delete").mockImplementation(async (id) => {
    const existing = courses.get(id)
    if (!existing) throw new NotFoundError("Course not found")
    courses.delete(id)

    return existing
  })

  return repo
}
