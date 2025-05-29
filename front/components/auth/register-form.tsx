"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import type { ListCourses200Item } from "@/lib/api/axios/generated.schemas"
import { createUser } from "@/lib/api/axios/user"
import { passwordSchemaRegistration } from "@/lib/validations/password-schema"
import { sendGAEvent } from "@next/third-parties/google"
import { toast } from "sonner"
import { Input } from "../form/input"
import { PasswordInput } from "../form/password"
import { Select } from "../form/select"
import { Form } from "../ui/form"

const registrationFormSchema = z
  .object({
    name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
    email: z.string().email({ message: "Email inválido." }),
    password: passwordSchemaRegistration,
    confirmPassword: z.string().min(1, { message: "Confirme sua senha." }),
    courseId: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type RegistrationFormData = z.infer<typeof registrationFormSchema>

interface RegisterFormProps {
  courses?: ListCourses200Item[]
}

export function RegisterForm({ courses }: RegisterFormProps) {
  const router = useRouter()

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      courseId: undefined,
    },
  })

  async function onSubmit({ name, email, password, courseId }: RegistrationFormData) {
    sendGAEvent({
      event: "sign_up_started",
    })

    const [error] = await createUser({ name, email, password, courseId })
    if (error) {
      console.error(error)

      sendGAEvent({
        event: "sign_up_failed",
        params: { error_code: error.code ?? "unknown" },
      })

      toast.error("Erro ao criar conta", { description: "Verifique os dados e tente novamente." })
      return
    }

    sendGAEvent({
      event: "sign_up_completed",
    })
    toast.success("Conta criada com sucesso!", { description: "Você já pode fazer login." })
    router.push("/login")
  }

  const { isLoading } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input name="name" label="Nome" placeholder="Seu nome completo" />

        <Input name="email" label="Email" placeholder="seu@email.com" />

        {courses && courses.length > 0 && (
          <Select
            name="courseId"
            label="Curso"
            placeholder="Selecione seu curso"
            options={courses.map((course) => ({
              value: course.id,
              label: course.code,
            }))}
          />
        )}

        <PasswordInput name="password" label="Senha" placeholder="******" />

        <Input name="confirmPassword" label="Confirmar Senha" placeholder="******" type="password" />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  )
}
