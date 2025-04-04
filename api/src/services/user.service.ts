import { hashPassword } from "@/lib/utils/crypto.utils"
import { UserRepository } from "@/repositories/user.repository"
import { createUserSchema, createUserWithGoogleSchema, updateUserSchema } from "@/schemas/user.schema"
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

  async updateUser(userId: number, data: Prisma.userUpdateInput): Promise<user> {
    const userData = updateUserSchema.parse(data)

    if (userData.password) {
      userData.password = await hashPassword(userData.password)
    }

    return this.userRepository.updateUser(userId, userData)
  }
}
