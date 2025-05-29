"use client"

import { Form } from "@/components/ui/form"
import { resetPassword } from "@/lib/api/axios/password-reset"
import { passwordSchema } from "@/shared/schemas/common.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendGAEvent } from "@next/third-parties/google"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { PasswordInput } from "../form/password"
import { SubmitButton } from "../submit-button"

const formSchema = z
  .object({ password: passwordSchema, confirmPassword: passwordSchema })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type FormSchema = z.infer<typeof formSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tokenFromUrl = searchParams.get("token") || ""

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit({ password }: FormSchema) {
    sendGAEvent({
      event: "password_reset_started",
      params: { token_present: !!tokenFromUrl },
    })

    const [err] = await resetPassword({ password, token: tokenFromUrl })

    if (err) {
      toast.error("Erro ao redefinir sua senha. Verifique o token e tente novamente.", {
        description: "Se o problema persistir, entre em contato com o suporte.",
      })
      return
    }

    sendGAEvent({
      event: "password_reset_completed",
    })
    toast.success("Senha redefinida com sucesso!", {
      description: "Você já pode fazer login com sua nova senha.",
    })

    router.push("/login")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PasswordInput
          name="password"
          placeholder="********"
          label="Nova senha"
          autoCapitalize="none"
          autoComplete="new-password"
          autoCorrect="off"
        />

        <PasswordInput
          name="confirmPassword"
          placeholder="********"
          label="Confirme a nova senha"
          autoCapitalize="none"
          autoComplete="newpassword"
          autoCorrect="off"
        />

        <SubmitButton className="w-full" loadingText="Redefinindo...">
          Redefinir senha
        </SubmitButton>
      </form>
    </Form>
  )
}
