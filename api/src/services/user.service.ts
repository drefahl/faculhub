import { hashPassword } from "@/lib/utils/crypto.utils"
import { UserRepository } from "@/repositories/user.repository"
import { createUserSchema } from "@/schemas/user.schema"
import type { user } from "@prisma/client"

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async createUser(data: unknown): Promise<user> {
    const userData = createUserSchema.parse(data)

    const emailExists = await this.userRepository.getUserByEmail(userData.email)
    if (emailExists) {
      throw new Error("Email already exists")
    }

    const hashedPassword = userData.password ? await hashPassword(userData.password) : null

    return this.userRepository.createUser({ ...userData, password: hashedPassword })
  }

  async getUserById(userId: number): Promise<user | null> {
    return this.userRepository.getUserById(userId)
  }

  async updateUser(userId: number, data: unknown): Promise<user> {
    return this.userRepository.updateUser(userId, data as Partial<user>)
  }
}
