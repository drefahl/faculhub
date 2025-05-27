"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import type { ListCourses200Item } from "@/lib/api/axios/generated.schemas"
import { createUser } from "@/lib/api/axios/user"
import { enrollmentNumberSchema } from "@/lib/validations/enrollment-number"
import { passwordSchemaRegistration } from "@/lib/validations/password-schema"
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
    enrollmentNumber: enrollmentNumberSchema,
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
      enrollmentNumber: "",
    },
  })

  async function onSubmit({ name, email, password, courseId }: RegistrationFormData) {
    const [error] = await createUser({ name, email, password, courseId })
    if (error) {
      console.error(error)

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

        <Input
          type="text"
          name="enrollmentNumber"
          label="Matrícula"
          placeholder="Número de matrícula"
          maxLength={10}
          description="Número de matrícula fornecido pela instituição"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />

        <PasswordInput name="password" label="Senha" placeholder="******" />

        <Input name="confirmPassword" label="Confirmar Senha" placeholder="******" type="password" />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </Form>
  )
}
