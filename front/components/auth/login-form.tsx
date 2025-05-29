"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { login } from "@/lib/api/axios/auth"
import { getCookie } from "@/lib/utils/cookie.utils"
import { setTokenCookie } from "@/lib/utils/token"
import { passwordSchemaLogin } from "@/lib/validations/password-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendGAEvent } from "@next/third-parties/google"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Input } from "../form/input"
import { PasswordInput } from "../form/password"
import { GoogleIcon } from "../icons/google-icon"
import { SubmitButton } from "../submit-button"
import { Separator } from "../ui/separator"

const loginFormValidationSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: passwordSchemaLogin,
})

type LoginFormValues = z.infer<typeof loginFormValidationSchema>

export function LoginForm() {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit({ email, password }: LoginFormValues) {
    sendGAEvent("event", "login_started", { method: "email" })

    const [error, response] = await login({ email, password })
    if (error) {
      toast.error("Erro ao fazer login", { description: "Verifique suas credenciais e tente novamente." })
      return
    }

    const { token } = response

    await setTokenCookie(token)
    sendGAEvent("event", "login_success", { method: "email" })

    toast.success("Login realizado com sucesso!", { description: "Bem-vindo de volta!" })

    const redirectTo = await getCookie("redirectTo")
    router.push(redirectTo || "/")
  }

  function handleGoogleSignIn() {
    sendGAEvent("event", "login_started", { method: "google" })
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login/google`
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn}>
        <span className="flex items-center justify-center gap-2">
          <GoogleIcon className="h-4 w-4" />
          Continuar com Google
        </span>
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input name="email" type="email" label="Email" placeholder="seu@email.com" />

          <PasswordInput
            name="password"
            label="Senha"
            placeholder="••••••••"
            showRequirements={false}
            showStrength={false}
          />

          <SubmitButton className="w-full" pendingCallback={() => "Entrando"}>
            Entrar
          </SubmitButton>
        </form>
      </Form>
    </div>
  )
}
