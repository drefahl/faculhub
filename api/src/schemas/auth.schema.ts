import { z } from "zod"
import { passwordSchema } from "./common.schema"

export const authSchema = z.object({
  email: z.string({ message: "Username is required" }).trim().email({ message: "Invalid email" }),
  password: passwordSchema,
})

export type AuthInput = z.infer<typeof authSchema>
