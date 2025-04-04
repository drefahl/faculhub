import { z } from "zod"

export const RequestBodyAuthSchema = z.object({
  email: z.string({ message: "Username is required" }).trim().email({ message: "Invalid email" }),
  password: z.string({ message: "Password is required" }),
})

export type RequestBodyAuth = z.infer<typeof RequestBodyAuthSchema>

export const ResponseBodyAuthSchema = {
  200: z.object({ message: z.literal("Authenticated successfully") }),
  401: z.object({ message: z.string() }),
}
