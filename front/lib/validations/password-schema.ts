import { z } from "zod"

export const passwordSchemaLogin = z.string().min(1, { message: "Digite a senha" })

export const passwordSchemaRegistration = z
  .string()
  .min(1, { message: "Senha é obrigatória" })
  .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Senha deve conter pelo menos uma letra maiúscula",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Senha deve conter pelo menos uma letra minúscula",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Senha deve conter pelo menos um número",
  })
  .refine((password) => /[^A-Za-z0-9]/.test(password), {
    message: "Senha deve conter pelo menos um caractere especial",
  })
