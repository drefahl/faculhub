import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login - FaculHub",
  description: "Faça login na sua conta FaculHub",
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Bem-vindo ao FaculHub</h1>
        <p className="text-sm text-muted-foreground">Entre com seu email e senha para acessar</p>
      </div>
      <LoginForm />
      <div className="space-y-4">
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/register" className="hover:text-brand underline underline-offset-4">
            Não tem uma conta? Registre-se
          </Link>
        </p>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link href="/forgot-password" className="hover:text-brand underline underline-offset-4">
            Esqueceu a senha?
          </Link>
        </p>
      </div>
    </div>
  )
}
