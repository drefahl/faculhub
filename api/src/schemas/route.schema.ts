import z from "zod"

export const idParametersSchema = z.object({ id: z.coerce.number() })
