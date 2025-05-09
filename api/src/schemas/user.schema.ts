import { z } from "zod"
import { passwordSchema } from "./common.schema"

const pictureSchema = z.string().nullable().optional()
const emailSchema = z.string().email({ message: "Invalid email" })

export const createUserSchema = z
  .object({
    email: emailSchema,
    name: z.string().trim(),
    profilePicId: pictureSchema,
    password: passwordSchema,
  })
  .strict()

export type CreateUserInput = z.infer<typeof createUserSchema>

export const createUserWithGoogleSchema = z.object({
  googleId: z.string(),
  email: emailSchema,
  name: z.string().optional(),
  profilePicId: pictureSchema,
})

export type CreateUserWithGoogleInput = z.infer<typeof createUserWithGoogleSchema>

export const updateUserSchema = z
  .object({
    name: z.string().max(255, { message: "Name must be at most 255 characters" }).optional(),
    email: z.string().email().optional(),
    profilePicId: pictureSchema,
    currentPassword: passwordSchema.optional(),
    newPassword: passwordSchema.optional(),
    confirmPassword: passwordSchema.optional(),
    role: z.enum(["USER"]).optional(),
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
    profilePicId: pictureSchema,
  })
  .nullable()

export type ResponseGetUserOutput = z.infer<typeof ResponseGetUserSchema>
