import { z } from "zod"

const pictureSchema = z.string().nullable().optional()
const emailSchema = z.string().email({ message: "E-mail inválido" })

export const createUserSchema = z.object({
  email: emailSchema,
  name: z.string(),
  picture: pictureSchema,
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const createUserWithGoogleSchema = z.object({
  googleId: z.string(),
  email: emailSchema,
  name: z.string().optional(),
  picture: pictureSchema,
})

export type CreateUserWithGoogleInput = z.infer<typeof createUserWithGoogleSchema>

export const updateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    picture: pictureSchema,
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6).optional(),
    confirmPassword: z.string().min(6).optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return data.newPassword === data.confirmPassword
      }
      return true
    },
    {
      message: "Passwords do not match",
    },
  )

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const ResponseGetUserSchema = z
  .object({
    id: z.number(),
    email: z.string(),
    name: z.string().nullable(),
    picture: pictureSchema,
  })
  .nullable()

export type ResponseGetUserOutput = z.infer<typeof ResponseGetUserSchema>
