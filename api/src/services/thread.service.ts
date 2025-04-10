import type { ThreadRepository } from "@/repositories/thread.repository"
import {
  type CreateThreadSchema,
  type UpdateThreadSchema,
  createThreadSchema,
  updateThreadSchema,
} from "@/schemas/thread.schema"

export class ThreadService {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async create(data: CreateThreadSchema) {
    createThreadSchema.parse(data)

    const { authorId, ...rest } = data

    return this.threadRepository.createThread({ ...rest, author: { connect: { id: authorId } } })
  }

  async getById(id: number) {
    return this.threadRepository.getThreadById(id)
  }

  async update(id: number, data: UpdateThreadSchema) {
    updateThreadSchema.parse(data)

    return this.threadRepository.updateThread(id, data)
  }

  async delete(id: number) {
    return this.threadRepository.deleteThread(id)
  }
}
