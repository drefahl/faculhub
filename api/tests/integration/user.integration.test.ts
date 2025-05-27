import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { NotFoundError } from "@/errors/NotFoundError"
import { createCourseService, createFileService, createUserService } from "@/factories/serviceFactory"
import { comparePassword } from "@/lib/utils/crypto.utils"
import { resetDatabase } from "tests/helpers/reset-db"
import { beforeEach, describe, expect, it } from "vitest"
import { ZodError } from "zod"

const userService = createUserService()
const fileService = createFileService()
const courseService = createCourseService()

describe("UserService Integration", () => {
  const email = "user@test.com"
  const password = "Str0ngP@ss"
  const enrollment = "2023012345"

  let userId: number
  let courseId: number

  beforeEach(async () => {
    await resetDatabase()

    const course = await courseService.createCourse({ name: "Test Course", code: "TEST123" })
    courseId = course.id

    const user = await userService.createUser({
      email,
      name: "User",
      password,
      enrollmentNumber: enrollment,
    })
    userId = user.id
  })

  it("should create a user with encrypted password", async () => {
    const user = await userService.getUserById(userId)

    expect(user).toBeDefined()
    expect(user?.password).not.toBe(password)
    expect(await comparePassword(password, user!.password!)).toBe(true)
  })

  it("should not allow duplicate emails", async () => {
    await expect(() =>
      userService.createUser({
        email,
        name: "New",
        password,
        enrollmentNumber: enrollment,
      }),
    ).rejects.toThrow("Email already exists")
  })

  it("should get user by ID", async () => {
    const user = await userService.getUserById(userId)

    expect(user?.email).toBe(email)
  })

  it("should return null for non-existing user", async () => {
    const user = await userService.getUserById(0)

    expect(user).toBeNull()
  })

  it("should update user name only", async () => {
    const updated = await userService.updateUser(userId, { name: "New Name", email })

    expect(updated.name).toBe("New Name")
    expect(updated.email).toBe(email)
  })

  it("should update password if current password is correct", async () => {
    const newPassword = "N3w@pass"
    const updated = await userService.updateUser(userId, {
      email,
      currentPassword: password,
      newPassword,
      confirmPassword: newPassword,
    })

    expect(await comparePassword(newPassword, updated.password!)).toBe(true)
  })

  it("should not update password if current password is wrong", async () => {
    const updated = userService.updateUser(userId, {
      email,
      currentPassword: "Wr0ng@Pass",
      newPassword: "Another@123",
      confirmPassword: "Another@123",
    })

    await expect(updated).rejects.toThrow(InvalidCredentialsError)
  })

  it("should throw if new and confirm passwords do not match", async () => {
    const updated = userService.updateUser(userId, {
      email,
      currentPassword: password,
      newPassword: "NewOne",
      confirmPassword: "DifferentOne",
    })

    await expect(updated).rejects.toThrow("Passwords do not match")
  })

  it("should update profile picture", async () => {
    const user = await userService.updateUserProfileImage(userId, "avatar.png", "image/png", Buffer.from("mock"))

    const file = await fileService.getFileById(user.profilePicId!)

    expect(file).toBeDefined()
    expect(file?.filename).toBe("avatar.png")
    expect(file?.mimeType).toBe("image/png")

    expect(user.profilePicId).toBe(file?.id)
  })

  it("should delete profile picture", async () => {
    await userService.updateUserProfileImage(userId, "avatar.png", "image/png", Buffer.from("mock"))
    const user = await userService.deleteUserProfileImage(userId)

    expect(user.profilePicId).toBeNull()
  })

  it("should throw on update image if user does not exist", async () => {
    await expect(userService.updateUserProfileImage(0, "avatar.png", "image/png", Buffer.from("mock"))).rejects.toThrow(
      "User not found",
    )
  })

  it("should throw on delete profile image if no profilePicId exists", async () => {
    const cleanUser = await userService.updateUser(userId, { email, name: "Clean" })

    await expect(userService.deleteUserProfileImage(cleanUser.id)).rejects.toThrow("No profile image to delete")
  })

  it("should throw error if file is not a valid image", async () => {
    await expect(
      userService.updateUserProfileImage(userId, "avatar.txt", "text/plain", Buffer.from("mock")),
    ).rejects.toThrow(ZodError)
  })

  it("should create a user with a valid courseId", async () => {
    const newEmail = "withcourse@test.com"
    const newUser = await userService.createUser({
      email: newEmail,
      name: "ComCurso",
      password,
      enrollmentNumber: "2023002314",
      courseId,
    })

    expect(newUser.courseId).toBe(courseId)
    expect(await comparePassword(password, newUser.password!)).toBe(true)
  })

  it("should throw NotFoundError when creating user with non-existing courseId", async () => {
    await expect(() =>
      userService.createUser({
        email: "nocourse@test.com",
        name: "SemCurso",
        password,
        enrollmentNumber: "2023002315",
        courseId: 9999,
      }),
    ).rejects.toThrow(NotFoundError)
  })

  it("should update user by connecting to a new valid courseId", async () => {
    const otherCourse = await courseService.createCourse({ name: "Other Course", code: "OTHER123" })

    const updated = await userService.updateUser(userId, {
      email,
      name: "User",
      courseId: otherCourse.id,
    })

    expect(updated.courseId).toBe(otherCourse.id)
  })

  it("should throw NotFoundError when updating user with non-existing courseId", async () => {
    await expect(() =>
      userService.updateUser(userId, {
        email,
        name: "User",
        courseId: 8888,
      }),
    ).rejects.toThrow(NotFoundError)
  })

  it("should throw error if enrollment number already exists", async () => {
    await expect(() =>
      userService.createUser({
        email: "test@test.com",
        name: "Test User",
        password,
        enrollmentNumber: enrollment,
        courseId,
      }),
    ).rejects.toThrow(Error)
  })

  it("should throw error if updating user with existing enrollment number", async () => {
    const existingUser = await userService.createUser({
      email: "existing@test.com",
      name: "Existing User",
      password,
      enrollmentNumber: "2023002314",
      courseId,
    })

    await expect(() =>
      userService.updateUser(userId, {
        email,
        name: "User",
        enrollmentNumber: existingUser.enrollmentNumber,
      }),
    ).rejects.toThrow(Error)
  })

  it("should allow updating user with a different enrollment number", async () => {
    const newEnrollment = "2023012346"
    const updated = await userService.updateUser(userId, {
      email,
      name: "User",
      enrollmentNumber: newEnrollment,
    })

    expect(updated.enrollmentNumber).toBe(newEnrollment)
  })
})
