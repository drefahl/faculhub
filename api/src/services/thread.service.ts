import { NotFoundError } from "@/errors/NotFoundError"
import type { ThreadRepository } from "@/repositories/thread.repository"
import type { UserRepository } from "@/repositories/user.repository"
import {
  type CreateThreadInput,
  type UpdateThreadInput,
  createThreadSchema,
  updateThreadSchema,
} from "@/schemas/thread.schema"

export class ThreadService {
  constructor(
    private readonly threadRepository: ThreadRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateThreadInput) {
    createThreadSchema.parse(data)

    const { authorId, ...rest } = data

    const author = await this.userRepository.getUserById(authorId)
    if (!author) throw new NotFoundError("Author not found")

    return this.threadRepository.createThread({ ...rest, author: { connect: { id: authorId } } })
  }

  async getById(id: number) {
    return this.threadRepository.getThreadById(id)
  }

  async update(id: number, data: UpdateThreadInput) {
    updateThreadSchema.parse(data)

    const thread = await this.threadRepository.getThreadById(id)
    if (!thread) throw new NotFoundError("Thread not found")

    return this.threadRepository.updateThread(id, data)
  }

  async delete(id: number) {
    const thread = await this.threadRepository.getThreadById(id)
    if (!thread) throw new NotFoundError("Thread not found")

    return this.threadRepository.deleteThread(id)
  }

  async list({ page, take }: { page: number; take: number }) {
    if (page < 1) throw new Error("Page must be greater than 0")
    if (take < 1) throw new Error("Take must be greater than 0")

    const skip = (page - 1) * take

    return this.threadRepository.listThreads({ take, skip })
  }
}
