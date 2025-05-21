import { z } from "zod"

export const createThreadSchema = z.object({
  title: z.string().nonempty().min(2, { message: "Title is required" }),
  content: z.string().nonempty().min(2, { message: "Content is required" }),
  categories: z.array(z.number().int().positive()).optional(),
  authorId: z.coerce.number().int().positive(),
})

export type CreateThreadInput = z.infer<typeof createThreadSchema>

export const updateThreadSchema = z
  .object({
    title: z.string().optional(),
    content: z.string().optional(),
    categories: z.array(z.number().int().positive()).optional(),
  })
  .strict()
  .refine(
    (data) => {
      return data.title || data.content || data.categories
    },
    { message: "At least one field is required" },
  )

export type UpdateThreadInput = z.infer<typeof updateThreadSchema>
