import { z } from "zod"

export const createCommentSchema = z.object({
  threadId: z.coerce.number().int().positive(),
  authorId: z.coerce.number().int().positive(),
  content: z.string().min(1, { message: "Content is required" }),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>

export const updateCommentSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }).nonempty(),
})

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
