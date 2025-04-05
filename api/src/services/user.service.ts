import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError"
import { comparePassword, hashPassword } from "@/lib/utils/crypto.utils"
import { UserRepository } from "@/repositories/user.repository"
import {
  type UpdateUserInput,
  createUserSchema,
  createUserWithGoogleSchema,
  updateUserSchema,
} from "@/schemas/user.schema"
import type { Prisma, user } from "@prisma/client"

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async createUser(data: Prisma.userCreateInput): Promise<user> {
    const userData = createUserSchema.parse(data)

    const emailExists = await this.userRepository.getUserByEmail(userData.email)
    if (emailExists) {
      throw new Error("Email already exists")
    }

    const hashedPassword = await hashPassword(userData.password)
    userData.password = hashedPassword

    return this.userRepository.createUser(userData)
  }

  async createUserWithGoogle(data: Prisma.userCreateInput): Promise<user> {
    const userData = createUserWithGoogleSchema.parse(data)

    const emailExists = await this.userRepository.getUserByEmail(userData.email)
    if (emailExists) {
      throw new Error("Email already exists")
    }

    return this.userRepository.createUser(userData)
  }

  async getUserById(userId: number): Promise<Omit<user, "password"> | null> {
    return this.userRepository.getUserById(userId)
  }

  async getUserByEmail(email: string): Promise<user | null> {
    return this.userRepository.getUserByEmail(email)
  }

  async updateUser(userId: number, data: UpdateUserInput): Promise<user> {
    const validatedData = updateUserSchema.parse(data)

    const user = await this.userRepository.getUserById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    const { currentPassword, newPassword, confirmPassword, ...baseUserData } = validatedData

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

    return this.userRepository.updateUser(userId, updateData)
  }
}
