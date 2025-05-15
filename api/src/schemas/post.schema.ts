import { z } from "zod"

export const createPostSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    type: z.enum(["NEWS", "EVENT"]),
    isPinned: z.boolean().optional(),
    eventDate: z.coerce.date().optional(),
    location: z.string().optional(),
    authorId: z.number().int().positive(),
    courses: z.array(z.coerce.number().int().positive()).optional().default([]).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "EVENT") {
        return data.eventDate !== undefined && data.location !== undefined
      }
      return true
    },
    {
      message: "Event date and location are required for EVENT type",
      path: ["eventDate", "location"],
    },
  )

export type CreatePostInput = z.infer<typeof createPostSchema>

export const updatePostSchema = z
  .object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    type: z.enum(["NEWS", "EVENT"]).optional(),
    isPinned: z.boolean().optional(),
    eventDate: z.coerce.date().optional(),
    location: z.string().optional(),
    courses: z.array(z.coerce.number().int().positive()).optional().default([]).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "EVENT") {
        return data.eventDate !== undefined && data.location !== undefined
      }
      return true
    },
    {
      message: "Event date and location are required for EVENT type",
      path: ["eventDate", "location"],
    },
  )

export type UpdatePostInput = z.infer<typeof updatePostSchema>

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  type: z.enum(["NEWS", "EVENT"]),
  isPinned: z.boolean(),
  eventDate: z.union([z.string(), z.date()]).nullable(),
  location: z.string().nullable(),
  views: z.number(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
  author: z.object({
    id: z.number(),
    name: z.string().nullable(),
    profilePicId: z.string().nullable(),
  }),
  courses: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      code: z.string(),
    }),
  ),
  isLiked: z.boolean().optional(),
  _count: z.object({ likes: z.number().default(0) }),
})

export const postResponseArraySchema = z.object({
  data: z.array(postSchema),
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
})
