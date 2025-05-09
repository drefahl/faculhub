"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Input } from "@/components/form/input"
import { PasswordInput } from "@/components/form/password"
import { SubmitButton } from "@/components/submit-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { refresh } from "@/lib/api/axios/auth"
import { useUpdateUserProfile } from "@/lib/api/react-query/user"
import { isGoogleAccount, isUsingCredentials } from "@/lib/utils/user.utils"
import { passwordSchema } from "@/lib/validations/password-schema"
import type { Session } from "@/types"
import { useRouter } from "next/navigation"

interface PasswordFormProps {
  session: Session
}

export function PasswordForm({ session }: PasswordFormProps) {
  const router = useRouter()

  const { mutate: updatePassword } = useUpdateUserProfile()

  const googleAccount = isGoogleAccount(session.providers)
  const isUsingAuthCredentials = isUsingCredentials(session.providers)

  const passwordFormSchema = z
    .object({
      currentPassword: z.string().min(1, { message: "Senha atual deve ter pelo menos 6 caracteres" }).optional(),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(1, { message: "Confirme sua nova senha" }),
    })
    .refine(
      ({ confirmPassword, newPassword, currentPassword }) => {
        if (isUsingAuthCredentials) {
          return newPassword === confirmPassword && currentPassword !== newPassword
        }
        return newPassword === confirmPassword
      },
      {
        path: ["confirmPassword"],
        message: "As senhas não coincidem",
      },
    )

  type PasswordFormValues = z.infer<typeof passwordFormSchema>

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: isUsingAuthCredentials
      ? {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }
      : {
          newPassword: "",
          confirmPassword: "",
        },
  })

  function onSubmit(data: PasswordFormValues) {
    updatePassword(
      {
        data,
      },
      {
        onSuccess: async () => {
          await refresh({ withCredentials: true })
          toast.success(isUsingAuthCredentials ? "Senha atualizada" : "Senha definida", {
            description: isUsingAuthCredentials
              ? "Sua senha foi atualizada com sucesso."
              : "Sua senha foi definida com sucesso.",
          })
          form.reset()
          router.refresh()
        },
        onError: (error) => {
          toast.error("Erro", {
            description: error.message || "Algo deu errado",
          })
        },
      },
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isUsingAuthCredentials ? "Alterar Senha" : "Definir Senha"}</CardTitle>
        <CardDescription>
          {isUsingAuthCredentials
            ? "Atualize sua senha para manter sua conta segura"
            : "Defina uma senha para poder fazer login com seu email e senha"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {googleAccount && !isUsingAuthCredentials && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Conta Google</AlertTitle>
            <AlertDescription>
              Você está conectado com o Google. Definir uma senha permitirá que você também faça login usando seu email
              e senha.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {isUsingAuthCredentials && (
              <Input name="currentPassword" label="Senha Atual" type="password" placeholder="••••••••" />
            )}

            <PasswordInput name="newPassword" label="Nova Senha" placeholder="••••••••" />

            <Input name="confirmPassword" label="Confirmar Nova Senha" type="password" placeholder="••••••••" />

            <div className="flex justify-end">
              <SubmitButton>{isUsingAuthCredentials ? "Atualizar senha" : "Definir senha"}</SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
