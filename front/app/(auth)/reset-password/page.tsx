import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Redefinir senha - FaculHub",
  description: "Defina uma nova senha para sua conta FaculHub",
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Redefinir senha</h1>
        <p className="text-sm text-muted-foreground">Digite sua nova senha para recuperar o acesso à sua conta</p>
      </div>
      <ResetPasswordForm />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:text-brand underline underline-offset-4">
          Voltar para o login
        </Link>
      </p>
    </div>
  )
}
