import { z } from "zod"

export const enrollmentNumberSchema = z
  .string()
  .regex(/^20(?:1[7-9]|[2-9]\d)\d{6}$/, { message: "Número de matrícula inválido." })
  .nullable()
  .optional()
