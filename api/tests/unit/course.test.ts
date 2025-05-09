import { NotFoundError } from "@/errors/NotFoundError"
import type { CreateCourseInput } from "@/schemas/course.schema"
import type { CourseService } from "@/services/course.service"
import { beforeEach, describe, expect, it } from "vitest"
import { createMockServices } from "./mocks/factories"

describe("CourseService Unit Tests", () => {
  let service: CourseService

  beforeEach(() => {
    service = createMockServices().courseService
  })

  it("should create a course with valid data", async () => {
    const data: CreateCourseInput = { name: "Novo Curso", code: "NC100" }
    const course = await service.createCourse(data)

    expect(course).toHaveProperty("id")
    expect(course.name).toBe(data.name)
    expect(course.code).toBe(data.code)
  })

  it("should list all courses", async () => {
    await service.createCourse({ name: "Listable Course", code: "LC101" })
    const list = await service.listCourses()

    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThan(0)
  })

  it("should get a course by id", async () => {
    const existing = await service.createCourse({ name: "Gettable Course", code: "GC101" })
    const found = await service.getCourseById(existing.id)

    expect(found).toEqual(existing)
  })

  it("should throw NotFoundError if course not found", async () => {
    await expect(service.getCourseById(9999)).rejects.toThrow(NotFoundError)
  })

  it("should update a course with valid data", async () => {
    const existing = await service.createCourse({ name: "Updatable Course", code: "UC101" })
    const updated = await service.updateCourse(existing.id, { name: "Atualizado" })

    expect(updated.id).toBe(existing.id)
    expect(updated.name).toBe("Atualizado")
    expect(updated.code).toBe(existing.code)
  })

  it("should throw NotFoundError if updating non-existent course", async () => {
    await expect(service.updateCourse(9999, { name: "X" })).rejects.toThrow(NotFoundError)
  })

  it("should delete a course", async () => {
    const existing = await service.createCourse({ name: "Updatable Course", code: "UC101" })

    const deleted = await service.deleteCourse(existing.id)
    expect(deleted.id).toBe(existing.id)

    await expect(service.getCourseById(existing.id)).rejects.toThrow(NotFoundError)
  })

  it("should throw NotFoundError when deleting non-existent course", async () => {
    await expect(service.deleteCourse(9999)).rejects.toThrow(NotFoundError)
  })
})
