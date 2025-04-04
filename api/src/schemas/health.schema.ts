import z from "zod"

export const healthCheckSchema = z.object({
  status: z.literal("ok"),
  time: z.string(),
  uptime: z.number(),
})
