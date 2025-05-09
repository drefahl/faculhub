import { z } from "zod"

export const likeParamsSchema = z.object({
  postId: z.coerce.number().int().positive(),
})

export const likeResponseSchema = z.object({
  id: z.number(),
  userId: z.number(),
  postId: z.number(),
})

export const unlikeResponseSchema = z.object({
  success: z.boolean(),
})

export const countLikesResponseSchema = z.object({
  count: z.number(),
})
