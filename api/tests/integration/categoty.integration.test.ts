import { NotFoundError } from "@/errors/NotFoundError"
import { createCategoryService } from "@/factories/serviceFactory"
import type { CategoryService } from "@/services/category.service"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"

describe("CategoryService Integration", () => {
  let categoryService: CategoryService

  beforeEach(async () => {
    await resetDatabase()

    categoryService = createCategoryService()
  })

  it("creates a category successfully", async () => {
    const category = await categoryService.create({ name: "Category" })

    expect(category.id).toBeDefined()
    expect(category.name).toBe("Category")
  })

  it("throws when creating a category with name already in use", async () => {
    await categoryService.create({ name: "Category" })
    await expect(categoryService.create({ name: "Category" })).rejects.toThrowError("Category name already in use")
  })

  it("lists categories successfully", async () => {
    await categoryService.create({ name: "Category 1" })
    await categoryService.create({ name: "Category 2" })

    const categories = await categoryService.list()

    expect(categories).toHaveLength(2)
    expect(categories[0].name).toBe("Category 1")
    expect(categories[1].name).toBe("Category 2")
  })

  it("gets a category by ID successfully", async () => {
    const category = await categoryService.create({ name: "Category" })

    const foundCategory = await categoryService.getById(category.id)
    expect(foundCategory).toBeDefined()
    expect(foundCategory?.name).toBe("Category")
  })

  it("throws when getting a category by non-existing ID", async () => {
    await expect(categoryService.getById(999)).rejects.toThrowError(NotFoundError)
  })

  it("updates a category successfully", async () => {
    const category = await categoryService.create({ name: "Category" })

    const updatedCategory = await categoryService.update(category.id, { name: "Updated Category" })

    expect(updatedCategory).toBeDefined()
    expect(updatedCategory?.name).toBe("Updated Category")
  })

  it("throws when updating a category to an existing name", async () => {
    await categoryService.create({ name: "Category 1" })
    const category = await categoryService.create({ name: "Category 2" })

    await expect(categoryService.update(category.id, { name: "Category 1" })).rejects.toThrowError(
      "Category name already in use",
    )
  })

  it("throws when updating a non-existing category", async () => {
    await expect(categoryService.update(999, { name: "Updated Category" })).rejects.toThrowError(NotFoundError)
  })

  it("deletes a category successfully", async () => {
    const category = await categoryService.create({ name: "Category" })

    await categoryService.delete(category.id)

    await expect(categoryService.getById(category.id)).rejects.toThrowError(NotFoundError)
  })

  it("throws when deleting a non-existing category", async () => {
    await expect(categoryService.delete(999)).rejects.toThrowError(NotFoundError)
  })
})
