import { NotFoundError } from "@/errors/NotFoundError"
import type { ThreadRepository } from "@/repositories/thread.repository"
import type { UserRepository } from "@/repositories/user.repository"
import {
  type CreateThreadInput,
  type UpdateThreadInput,
  createThreadSchema,
  updateThreadSchema,
} from "@/schemas/thread.schema"
import type { Prisma, category } from "@prisma/client"
import type { CategoryService } from "./category.service"

export class ThreadService {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create(data: CreateThreadInput) {
    createThreadSchema.parse(data)

    const { authorId, ...rest } = data

    const author = await this.userRepository.getUserById(authorId)
    if (!author) throw new NotFoundError("Author not found")

    let categories: category[] = []
    if (data.categories) {
      categories = await Promise.all(
        data.categories.map(async (categoryId) => this.categoryService.validateCategory(categoryId)),
      )

      if (categories.length !== data.categories.length) {
        throw new NotFoundError("Some categories not found")
      }
    }

    return this.threadRepository.createThread({
      ...rest,
      author: { connect: { id: authorId } },
      categories: { connect: categories },
    })
  }

  async getById(id: number) {
    return this.threadRepository.getThreadById(id)
  }

  async update(id: number, data: UpdateThreadInput) {
    updateThreadSchema.parse(data)

    const thread = await this.threadRepository.getThreadById(id)
    if (!thread) throw new NotFoundError("Thread not found")

    const updateData: Prisma.threadUpdateInput = {
      ...data,
      categories: { connect: data.categories?.map((id) => ({ id })) },
    }

    console.log("updateData", data)

    if (data.categories !== undefined) {
      if (Array.isArray(data.categories) && data.categories.length === 0) {
        updateData.categories = { set: [] }
      } else if (Array.isArray(data.categories)) {
        const categories = await Promise.all(
          data.categories.map(async (categoryId) => this.categoryService.validateCategory(categoryId)),
        )

        if (categories.length !== data.categories.length) {
          throw new NotFoundError("Some categories not found")
        }

        updateData.categories = { set: categories.map((category) => ({ id: category.id })) }
      }
    }

    return this.threadRepository.updateThread(id, updateData)
  }

  async delete(id: number) {
    const thread = await this.threadRepository.getThreadById(id)
    if (!thread) throw new NotFoundError("Thread not found")

    return this.threadRepository.deleteThread(id)
  }

  async list({ page, take, search, categoryId }: { page: number; take: number; search?: string; categoryId?: number }) {
    if (page < 1) throw new Error("Page must be greater than 0")
    if (take < 1) throw new Error("Take must be greater than 0")

    const skip = (page - 1) * take

    return this.threadRepository.listThreads({ take, skip, search, categoryId })
  }
}
