import { z } from "zod"

export const createCourseSchema = z.object({
  name: z.string(),
  code: z.string(),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>

export const updateCourseSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
})

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
