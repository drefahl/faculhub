import type { Prisma, user } from "@prisma/client"
import { z } from "zod"

export const createUserSchema: z.ZodType<Prisma.userCreateInput> = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  name: z.string(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema: z.ZodType<Partial<user>> = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  })
  .strict()

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const ResponseGetUserSchema: z.ZodType<Omit<user, "password"> | null> = z
  .object({
    id: z.number(),
    email: z.string(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .nullable()

export type ResponseGetUserOutput = z.infer<typeof ResponseGetUserSchema>
