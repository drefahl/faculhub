import { NotFoundError } from "@/errors/NotFoundError"
import { createCourseService } from "@/factories/serviceFactory"
import type { CourseService } from "@/services/course.service"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"

describe("CourseService Integration", () => {
  let service: CourseService

  beforeEach(async () => {
    await resetDatabase()

    service = createCourseService()
  })

  it("should create a course successfully", async () => {
    const data = { name: "New Course", code: "NC100" }
    const course = await service.createCourse(data)

    expect(course.id).toBeDefined()
    expect(course.name).toBe(data.name)
    expect(course.code).toBe(data.code)
  })

  it("should list all courses", async () => {
    await service.createCourse({ name: "Course A", code: "CA101" })
    await service.createCourse({ name: "Course B", code: "CB102" })

    const list = await service.listCourses()

    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBe(2)
  })

  it("should get a course by id or throw if not found", async () => {
    const created = await service.createCourse({ name: "Gettable", code: "GT103" })
    const found = await service.getCourseById(created.id)

    expect(found.id).toBe(created.id)

    await expect(service.getCourseById(0)).rejects.toBeInstanceOf(NotFoundError)
  })

  it("should update a course or throw if not found", async () => {
    const original = await service.createCourse({ name: "Orig", code: "O104" })
    const updated = await service.updateCourse(original.id, { name: "Updated" })

    expect(updated.id).toBe(original.id)
    expect(updated.name).toBe("Updated")
    expect(updated.code).toBe(original.code)

    await expect(service.updateCourse(0, { name: "X" })).rejects.toBeInstanceOf(NotFoundError)
  })

  it("should delete a course or throw if not found", async () => {
    const toDelete = await service.createCourse({ name: "Del", code: "D105" })
    const deleted = await service.deleteCourse(toDelete.id)

    expect(deleted.id).toBe(toDelete.id)

    await expect(service.getCourseById(toDelete.id)).rejects.toBeInstanceOf(NotFoundError)
    await expect(service.deleteCourse(0)).rejects.toBeInstanceOf(NotFoundError)
  })
})
