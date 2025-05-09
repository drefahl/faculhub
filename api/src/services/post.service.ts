import { NotFoundError } from "@/errors/NotFoundError"
import type { PostRepository } from "@/repositories/post.repository"
import { createPostSchema, updatePostSchema } from "@/schemas/post.schema"
import type { CreatePostInput, UpdatePostInput } from "@/schemas/post.schema"

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(data: CreatePostInput) {
    const { authorId, ...valid } = createPostSchema.parse(data)

    return this.postRepository.createPost({
      ...valid,
      author: { connect: { id: authorId } },
      courses: { connect: valid.courses?.map((course) => ({ id: course })) },
    })
  }

  async getById(id: number, userId?: number) {
    const post = await this.postRepository.getPostById(id, userId)
    if (!post) throw new NotFoundError("Post not found")

    return {
      ...post,
      isLiked: post.likes?.length > 0,
    }
  }

  async update(id: number, data: UpdatePostInput) {
    const valid = updatePostSchema.parse(data)
    await this.getById(id)

    return this.postRepository.updatePost(id, {
      ...valid,
      courses: { set: valid.courses?.map((course) => ({ id: course })) },
    })
  }

  async delete(id: number) {
    await this.getById(id)

    return this.postRepository.deletePost(id)
  }

  async list({
    page,
    take,
    search,
    course,
    type,
    userId,
  }: { page: number; take: number; search?: string; course?: number; type?: "EVENT" | "NEWS"; userId?: number }) {
    if (page < 1) throw new Error("Page must be greater than 0")
    if (take < 1) throw new Error("Take must be greater than 0")

    const skip = (page - 1) * take

    const { data, ...rest } = await this.postRepository.listPosts({ take, skip, search, course, type, userId })

    return {
      ...rest,
      data: data.map((post) => ({ ...post, isLiked: post.likes?.length > 0 })),
    }
  }

  async recordView(id: number, userId?: number) {
    await this.getById(id)

    const post = await this.postRepository.incrementViews(id, userId)

    return {
      ...post,
      isLiked: post.likes?.length > 0,
    }
  }
}
