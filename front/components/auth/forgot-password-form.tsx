"use client"

import { Form } from "@/components/ui/form"
import { requestPasswordReset } from "@/lib/api/axios/password-reset"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Input } from "../form/input"
import { SubmitButton } from "../submit-button"

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
})

type FormSchema = z.infer<typeof formSchema>

export function ForgotPasswordForm() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit({ email }: FormSchema) {
    const [err] = await requestPasswordReset({ email })

    if (err) {
      toast.error("Erro ao enviar email", {
        description: "Ocorreu um erro ao enviar o email de recuperação.",
      })
      return
    }

    toast.success("Email enviado com sucesso!", {
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Input
          name="email"
          label="Email"
          placeholder="seu@email.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
        />

        <SubmitButton className="w-full" loadingText="Enviando...">
          Enviar link de recuperação
        </SubmitButton>
      </form>
    </Form>
  )
}
