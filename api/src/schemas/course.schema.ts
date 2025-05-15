import { z } from "zod"

export const createCourseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  code: z.string().min(1, { message: "Code is required" }),
})

export type CreateCourseInput = z.infer<typeof createCourseSchema>

export const updateCourseSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  code: z.string().min(1, { message: "Code is required" }).optional(),
})

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>
