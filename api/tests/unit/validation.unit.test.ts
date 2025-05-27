import { createCategorySchema, updateCategorySchema } from "@/schemas/category.schema"
import { createCommentSchema, updateCommentSchema } from "@/schemas/comment.schema"
import { createCourseSchema, updateCourseSchema } from "@/schemas/course.schema"
import { imageFileSchema } from "@/schemas/file.schema"
import { createPostSchema, updatePostSchema } from "@/schemas/post.schema"
import { createThreadSchema, updateThreadSchema } from "@/schemas/thread.schema"
import { createUserSchema } from "@/schemas/user.schema"
import { describe, expect, it } from "vitest"

describe("User Validation", () => {
  it("should validate a valid user", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "Str0ngPassword123!",
      courseId: 1,
    })

    expect(result.success).toBe(true)
  })

  it("should fail for invalid email", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "invalid-email",
      password: "Str0ngPassword123!",
    })

    expect(result.success).toBe(false)
  })

  it("should fail for short password", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "short",
    })

    expect(result.success).toBe(false)
  })

  it("should fail for password without number", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "NoNumberPassword!",
    })

    expect(result.success).toBe(false)
  })

  it("should fail for password without special character", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "NoSpecialCharacter123",
    })
    expect(result.success).toBe(false)
  })

  it("should fail for password without uppercase letter", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "nouppercase123!",
    })
    expect(result.success).toBe(false)
  })

  it("should fail for password without lowercase letter", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "NOLOWERCASE123!",
    })
    expect(result.success).toBe(false)
  })

  it("should fail for invalid courseId", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "Str0ngPassword123!",
      courseId: -1,
    })

    expect(result.success).toBe(false)
  })

  it("should allow optional courseId to be undefined", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "Str0ngPassword123!",
      courseId: undefined,
    })

    expect(result.success).toBe(true)
  })

  it("should fail for invalid courseId", () => {
    const result = createUserSchema.safeParse({
      name: "Name",
      email: "user@example.com",
      password: "Str0ngPassword123!",
      courseId: -1,
    })

    expect(result.success).toBe(false)
  })

  describe("enrollmentNumber validation", () => {
    const base = {
      name: "Name",
      email: "user@example.com",
      password: "Str0ngPassword123!",
    }

    const validNumbers = ["2017000000", "2017999999", "2023002313", "2099123456"]
    for (const num of validNumbers) {
      it(`should accept valid enrollment number ${num}`, () => {
        const result = createUserSchema.safeParse({ ...base, enrollmentNumber: num })
        expect(result.success).toBe(true)
      })
    }

    const invalidNumbers = [
      "1917000000",
      "2107000000",
      "2016000000",
      "2015000000",
      "20A7000000",
      "201700000",
      "20170000000",
      "2017-002313",
    ]

    for (const num of invalidNumbers) {
      it(`should reject invalid enrollment number ${num}`, () => {
        const result = createUserSchema.safeParse({ ...base, enrollmentNumber: num })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.errors[0].message).toBe("Invalid enrollment number")
        }
      })
    }
  })
})

describe("Thread Schemas (unit)", () => {
  it("accepts valid create payload", () => {
    const result = createThreadSchema.safeParse({
      title: "My Thread",
      content: "Details here",
      authorId: 1,
    })

    expect(result.success).toBe(true)
  })

  it("rejects empty title or content", () => {
    const result = createThreadSchema.safeParse({
      title: "",
      content: "",
      authorId: 1,
    })

    expect(result.success).toBe(false)
  })

  it("accepts valid update payload", () => {
    const result = updateThreadSchema.safeParse({
      title: "Updated Title",
      content: "Updated content",
    })

    expect(result.success).toBe(true)
  })

  it("rejects unknown fields on update", () => {
    const result = updateThreadSchema.safeParse({ foo: "bar" })

    expect(result.success).toBe(false)
  })
})

describe("ImageFile Schema (unit)", () => {
  it("should validate a correct image payload", () => {
    const result = imageFileSchema.safeParse({
      filename: "picture.png",
      mimeType: "image/png",
      data: Buffer.from("binarydata"),
    })

    expect(result.success).toBe(true)
  })

  it("should fail for empty filename", () => {
    const result = imageFileSchema.safeParse({
      filename: "",
      mimeType: "image/png",
      data: Buffer.from("data"),
    })

    expect(result.success).toBe(false)
  })

  it("should fail for unsupported mimeType", () => {
    const result = imageFileSchema.safeParse({
      filename: "file.txt",
      mimeType: "text/plain",
      data: Buffer.from("text"),
    })

    expect(result.success).toBe(false)
  })

  it("should fail for non-Buffer data", () => {
    const result = imageFileSchema.safeParse({
      filename: "pic.jpg",
      mimeType: "image/jpeg",
      data: "not a buffer",
    } as any)

    expect(result.success).toBe(false)
  })
})

describe("Comment Schemas (unit)", () => {
  it("should validate a valid create payload", () => {
    const result = createCommentSchema.safeParse({ threadId: 1, authorId: 1, content: "Hello!" })
    expect(result.success).toBe(true)
  })

  it("should fail for empty content on create", () => {
    const result = createCommentSchema.safeParse({ threadId: 1, authorId: 1, content: "" })
    expect(result.success).toBe(false)
  })

  it("should validate a valid update payload", () => {
    const result = updateCommentSchema.safeParse({ content: "Updated comment" })
    expect(result.success).toBe(true)
  })

  it("should fail for empty content on update", () => {
    const result = updateCommentSchema.safeParse({ content: "" })
    expect(result.success).toBe(false)
  })
})

describe("Course Schemas (unit)", () => {
  it("should validate valid create payload", () => {
    const result = createCourseSchema.safeParse({ name: "Course 101", code: "C101" })
    expect(result.success).toBe(true)
  })

  it("should fail for empty name or code on create", () => {
    const invalid1 = createCourseSchema.safeParse({ name: "", code: "C101" })
    const invalid2 = createCourseSchema.safeParse({ name: "Course", code: "" })

    expect(invalid1.success).toBe(false)
    expect(invalid2.success).toBe(false)
  })

  it("should validate valid update payload", () => {
    const result = updateCourseSchema.safeParse({ name: "New Name" })
    expect(result.success).toBe(true)
  })
})

describe("createPostSchema (unit)", () => {
  it("should validate minimal NEWS post", () => {
    const result = createPostSchema.safeParse({
      title: "News Title",
      content: "Some content",
      type: "NEWS",
      authorId: 1,
    })

    expect(result.success).toBe(true)
  })

  it("should validate EVENT post with date and location", () => {
    const result = createPostSchema.safeParse({
      title: "Event Title",
      content: "Event details",
      type: "EVENT",
      authorId: 2,
      eventDate: new Date().toISOString(),
      location: "Main Hall",
      courses: [3, 4],
    })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.eventDate).toBeInstanceOf(Date)
      expect(result.data.location).toBe("Main Hall")
      expect(result.data.courses).toEqual([3, 4])
    }
  })

  it("should fail when type is EVENT but date or location is missing", () => {
    const missingDate = createPostSchema.safeParse({
      title: "Event Title",
      content: "Event details",
      type: "EVENT",
      authorId: 2,
      location: "Main Hall",
    })

    const missingLocation = createPostSchema.safeParse({
      title: "Event Title",
      content: "Event details",
      type: "EVENT",
      authorId: 2,
      eventDate: new Date().toISOString(),
    })

    expect(missingDate.success).toBe(false)
    expect(missingLocation.success).toBe(false)
  })

  it("should fail when title is missing or empty", () => {
    const missing = createPostSchema.safeParse({
      content: "x",
      type: "NEWS",
      authorId: 1,
    } as any)

    const empty = createPostSchema.safeParse({
      title: "",
      content: "x",
      type: "NEWS",
      authorId: 1,
    })

    expect(missing.success).toBe(false)
    expect(empty.success).toBe(false)
  })

  it("should fail for invalid authorId or courses", () => {
    const invalidAuthor = createPostSchema.safeParse({
      title: "T",
      content: "C",
      type: "NEWS",
      authorId: -1,
    })

    const invalidCourses = createPostSchema.safeParse({
      title: "T",
      content: "C",
      type: "NEWS",
      authorId: 1,
      courses: [0, -2, 3],
    })

    expect(invalidAuthor.success).toBe(false)
    expect(invalidCourses.success).toBe(false)
  })
})

describe("updatePostSchema (unit)", () => {
  it("should accept empty object (no changes)", () => {
    const result = updatePostSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it("should validate provided fields", () => {
    const result = updatePostSchema.safeParse({
      title: "New Title",
      content: "Updated content",
      type: "NEWS",
      isPinned: true,
      courses: [5],
    })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.title).toBe("New Title")
      expect(result.data.isPinned).toBe(true)
      expect(result.data.courses).toEqual([5])
    }
  })

  it("should fail for invalid optional fields", () => {
    const result = updatePostSchema.safeParse({
      title: "",
      courses: [0, "a" as any],
    })

    expect(result.success).toBe(false)
  })
})

describe("Category Schemas (unit)", () => {
  it("should validate a valid create payload", () => {
    const result = createCategorySchema.safeParse({ name: "Category Name" })
    expect(result.success).toBe(true)
  })

  it("should fail for empty name", () => {
    const result = createCategorySchema.safeParse({ name: "" })
    expect(result.success).toBe(false)
  })

  it("should validate a valid update payload", () => {
    const result = updateCategorySchema.safeParse({ name: "Updated Category" })
    expect(result.success).toBe(true)
  })

  it("should fail for empty name on update", () => {
    const result = updateCategorySchema.safeParse({ name: "" })
    expect(result.success).toBe(false)
  })
})
