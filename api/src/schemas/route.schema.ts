import z from "zod"

export const routeIdParametersSchema = z.object({ id: z.coerce.number() })
