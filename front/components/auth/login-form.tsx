"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { postApiAuthLogin } from "@/lib/api/default/default"
import { setCookieToken } from "@/lib/utils/token.util"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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
    try {
      const loginResponse = await postApiAuthLogin({
        email,
        password,
      })

      await setCookieToken(loginResponse.data.token)
      toast.success("Login realizado com sucesso!", { description: "Bem-vindo de volta!" })
      router.push("/")
    } catch (error) {
      toast.error("Erro ao fazer login", { description: "Verifique suas credenciais e tente novamente." })
      console.error("Error during login:", error)
    }
  }

  const { isLoading } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu.email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  )
}

const loginFormValidationSchema = z.object({
  email: z.string().email({ message: "Email inválido." }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres." }),
})

type LoginFormValues = z.infer<typeof loginFormValidationSchema>
