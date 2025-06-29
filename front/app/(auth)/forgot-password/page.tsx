import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Esqueci minha senha - FaculHub",
  description: "Recupere o acesso à sua conta FaculHub",
}

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Recuperar senha</h1>
        <p className="text-sm text-muted-foreground">Digite seu email para receber um link de recuperação</p>
      </div>
      <ForgotPasswordForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:text-brand underline underline-offset-4">
          Voltar para o login
        </Link>
      </p>
    </div>
  )
}
