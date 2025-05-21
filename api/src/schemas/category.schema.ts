import { z } from "zod"

export const createCategorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1, "O nome não pode ficar vazio").optional(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
