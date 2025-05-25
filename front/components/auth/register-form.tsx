"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { createUser } from "@/lib/api/axios/user"
import { passwordSchemaRegistration } from "@/lib/validations/password-schema"
import { toast } from "sonner"
import { Input } from "../form/input"
import { PasswordInput } from "../form/password"
import { Form } from "../ui/form"

const registrationFormSchema = z
  .object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
    email: z.string().email({ message: "Email inválido." }),
    password: passwordSchemaRegistration,
    confirmPassword: z.string().min(1, { message: "Confirme sua senha." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type RegistrationFormData = z.infer<typeof registrationFormSchema>

export function RegisterForm() {
  const router = useRouter()

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit({ name, email, password }: RegistrationFormData) {
    const [error] = await createUser({ name, email, password })
    if (error) {
      toast.error("Erro ao criar conta", { description: "Verifique os dados e tente novamente." })
      return
    }

    toast.success("Conta criada com sucesso!", { description: "Você já pode fazer login." })
    router.push("/login")
  }

  const { isLoading } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input name="name" label="Nome" placeholder="Seu nome completo" />

        <Input name="email" label="Email" placeholder="seu@email.com" />

        <PasswordInput name="password" label="Senha" placeholder="******" />

        <Input name="confirmPassword" label="Confirmar Senha" placeholder="******" type="password" />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  )
}
