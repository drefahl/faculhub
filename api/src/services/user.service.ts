import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { NotFoundError } from "@/errors/NotFoundError"
import { comparePassword, hashPassword } from "@/lib/utils/crypto.utils"
import type { UserRepository } from "@/repositories/user.repository"
import { passwordSchema } from "@/schemas/common.schema"
import { imageFileSchema } from "@/schemas/file.schema"
import {
  type CreateUserInput,
  type CreateUserWithGoogleInput,
  type UpdateUserInput,
  createUserSchema,
  createUserWithGoogleSchema,
  updateUserSchema,
} from "@/schemas/user.schema"
import type { Prisma, user } from "@prisma/client"
import type { CourseService } from "./course.service"
import type { FileService } from "./file.service"

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService,
    private readonly courseService: CourseService,
  ) {}

  async createUser(data: CreateUserInput): Promise<user> {
    const userData = createUserSchema.parse(data)

    const emailExists = await this.userRepository.getUserByEmail(userData.email)
    if (emailExists) {
      throw new Error("Email already exists")
    }

    if (userData.enrollmentNumber) {
      const enrollmentNumberExists = await this.userRepository.getUserByEnrollmentNumber(userData.enrollmentNumber)
      if (enrollmentNumberExists) {
        throw new Error("Enrollment number already exists")
      }
    }

    if (userData.courseId) {
      const course = await this.courseService.getCourseById(userData.courseId)
      if (!course) throw new NotFoundError("Course not found")
    }

    const hashedPassword = await hashPassword(userData.password)
    userData.password = hashedPassword

    return this.userRepository.createUser({ ...userData, role: "USER" })
  }

  async createUserWithGoogle(data: CreateUserWithGoogleInput): Promise<user> {
    const userData = createUserWithGoogleSchema.parse(data)

    const emailExists = await this.userRepository.getUserByEmail(userData.email)
    if (emailExists) {
      throw new Error("Email already exists")
    }

    return this.userRepository.createUser({ ...userData, role: "USER" })
  }

  async getUserById(userId: number): Promise<user | null> {
    return this.userRepository.getUserById(userId)
  }

  async getUserByEmail(email: string): Promise<user | null> {
    return this.userRepository.getUserByEmail(email)
  }

  async updateUser(userId: number, data: UpdateUserInput): Promise<user> {
    const validatedData = updateUserSchema.parse(data)

    const user = await this.userRepository.getUserById(userId)
    if (!user) {
      throw new NotFoundError("User not found")
    }

    const { currentPassword, newPassword, confirmPassword, courseId, enrollmentNumber, ...baseUserData } = validatedData

    const updateData: Prisma.userUpdateInput = { ...baseUserData }

    if (newPassword) {
      if (!user.password) {
        updateData.password = await hashPassword(newPassword)
      } else if (currentPassword) {
        const isPasswordValid = await comparePassword(currentPassword, user.password)
        if (!isPasswordValid) {
          throw new InvalidCredentialsError("Invalid current password")
        }
        updateData.password = await hashPassword(newPassword)
      }
    }

    if (enrollmentNumber) {
      const existingUser = await this.userRepository.getUserByEnrollmentNumber(enrollmentNumber)
      if (existingUser && existingUser.id !== userId) {
        throw new Error("Enrollment number already exists")
      }
      updateData.enrollmentNumber = enrollmentNumber.trim()
    }

    if (courseId) {
      const course = await this.courseService.getCourseById(courseId)
      if (!course) throw new NotFoundError("Course not found")
      updateData.course = { connect: { id: courseId } }
    }

    return this.userRepository.updateUser(userId, updateData)
  }

  async updateUserProfileImage(userId: number, filename: string, mimeType: string, data: Buffer) {
    imageFileSchema.parse({ filename, mimeType, data })

    const user = await this.userRepository.getUserById(userId)
    if (!user) throw new NotFoundError("User not found")

    if (user.profilePicId) {
      await this.fileService.deleteFile(user.profilePicId)
    }

    const file = await this.fileService.createFile(filename, mimeType, data)

    return this.userRepository.updateUser(userId, { profilePic: { connect: { id: file.id } } })
  }

  async deleteUserProfileImage(userId: number) {
    const user = await this.userRepository.getUserById(userId)
    if (!user) throw new NotFoundError("User not found")

    if (!user.profilePicId) throw new Error("No profile image to delete")

    const file = await this.fileService.getFileById(user.profilePicId)
    if (!file) throw new NotFoundError("File not found")

    await this.fileService.deleteFile(file.id)

    return this.userRepository.updateUser(userId, { profilePic: { disconnect: true } })
  }

  async updatePassword(userId: number, newPassword: string): Promise<user> {
    passwordSchema.parse(newPassword)

    const user = await this.userRepository.getUserById(userId)
    if (!user) {
      throw new NotFoundError("User not found")
    }

    const hashedPassword = await hashPassword(newPassword)

    return this.userRepository.updateUser(userId, { password: hashedPassword })
  }
}
