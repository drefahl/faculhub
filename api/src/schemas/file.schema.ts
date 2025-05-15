import z from "zod"

export const imageFileSchema = z.object({
  filename: z.string().nonempty(),
  mimeType: z.string().regex(/image\/(jpeg|png|gif|bmp|webp)/),
  data: z.instanceof(Buffer),
})

export type FileSchema = z.infer<typeof imageFileSchema>
