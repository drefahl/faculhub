"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Input } from "@/components/form/input"
import { SubmitButton } from "@/components/submit-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useUpdateUserProfile } from "@/lib/api/user/user"
import { isGoogleAccount, isOnlyUsingCredentials } from "@/lib/utils/user.utils"
import type { Session } from "@/types"

interface PasswordFormProps {
  session: Session
}

export function PasswordForm({ session }: PasswordFormProps) {
  const router = useRouter()
  const { mutate: updatePassword } = useUpdateUserProfile()

  const googleAccount = isGoogleAccount(session.providers)
  const isUsingCredentialsOnly = isOnlyUsingCredentials(session.providers)

  const passwordFormSchema = isUsingCredentialsOnly
    ? z
        .object({
          currentPassword: z.string().min(1, {
            message: "Senha atual é obrigatória",
          }),
          newPassword: z.string().min(6, {
            message: "Nova senha deve ter pelo menos 6 caracteres",
          }),
          confirmPassword: z.string().min(6, {
            message: "Confirme sua nova senha",
          }),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "As senhas não coincidem",
          path: ["confirmPassword"],
        })
    : z
        .object({
          newPassword: z.string().min(6, {
            message: "Nova senha deve ter pelo menos 6 caracteres",
          }),
          confirmPassword: z.string().min(6, {
            message: "Confirme sua nova senha",
          }),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "As senhas não coincidem",
          path: ["confirmPassword"],
        })

  type PasswordFormValues = z.infer<typeof passwordFormSchema>

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: isUsingCredentialsOnly
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
        currentPassword: "currentPassword" in data ? data.currentPassword : undefined,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success(isUsingCredentialsOnly ? "Senha atualizada" : "Senha definida", {
            description: isUsingCredentialsOnly
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
        <CardTitle>{isUsingCredentialsOnly ? "Alterar Senha" : "Definir Senha"}</CardTitle>
        <CardDescription>
          {isUsingCredentialsOnly
            ? "Atualize sua senha para manter sua conta segura"
            : "Defina uma senha para poder fazer login com seu email e senha"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {googleAccount && (
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
            {isUsingCredentialsOnly && (
              <Input name="currentPassword" label="Senha Atual" type="password" placeholder="••••••" />
            )}

            <Input
              name="newPassword"
              label="Nova Senha"
              type="password"
              placeholder="••••••"
              description="Sua senha deve ter pelo menos 6 caracteres."
            />

            <Input name="confirmPassword" label="Confirmar Nova Senha" type="password" placeholder="••••••" />

            <div className="flex justify-end">
              <SubmitButton>{isUsingCredentialsOnly ? "Atualizar senha" : "Definir senha"}</SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
