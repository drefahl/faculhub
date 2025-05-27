import { RegisterForm } from "@/components/auth/register-form"
import { listCourses } from "@/lib/api/axios/course"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Registrar - FaculHub",
  description: "Crie sua conta no FaculHub",
}

export default async function RegisterPage() {
  const [_, courses] = await listCourses()

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Crie sua conta</h1>
        <p className="text-sm text-muted-foreground">Preencha os campos abaixo para se registrar</p>
      </div>

      <RegisterForm courses={courses} />

      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link href="/login" className="hover:text-brand underline underline-offset-4">
          Já tem uma conta? Faça login
        </Link>
      </p>
    </div>
  )
}
