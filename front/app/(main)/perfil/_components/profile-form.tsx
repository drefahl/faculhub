"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Input } from "@/components/form/input"
import { MarkdownEditor } from "@/components/form/markdown-editor"
import { Select } from "@/components/form/select"
import { useSession } from "@/components/providers/session-provider"
import { SubmitButton } from "@/components/submit-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import type { GetUserProfile200 } from "@/lib/api/axios/generated.schemas"
import { useListCourses } from "@/lib/api/react-query/course"
import { useUpdateUserProfile } from "@/lib/api/react-query/user"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import { enrollmentNumberSchema } from "@/lib/validations/enrollment-number"
import { ProfileImageUpload } from "./profile-image-upload"

interface ProfileFormProps {
  profile: NonNullable<GetUserProfile200>
}

const profileFormSchema = z.object({
  name: z.string().trim().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }).max(50, {
    message: "Nome não pode ter mais de 50 caracteres.",
  }),
  courseId: z.coerce.number().int().positive().optional(),
  enrollmentNumber: enrollmentNumberSchema,
  about: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm({ profile }: ProfileFormProps) {
  const { session, refreshSession } = useSession()
  const { mutate: updateProfile, isPending } = useUpdateUserProfile()
  const { data: courses } = useListCourses()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name || "",
      courseId: profile?.courseId || undefined,
      enrollmentNumber: profile?.enrollmentNumber || "",
      about: profile?.about || "",
    },
  })

  function onSubmit(data: ProfileFormValues) {
    updateProfile(
      { data },
      {
        onSuccess: async () => {
          await refreshSession()
          toast.success("Perfil atualizado", {
            description: "Suas informações pessoais foram atualizadas com sucesso.",
          })
        },
        onError: (error) => {
          toast.error("Erro ao atualizar perfil", {
            description: error.message || "Algo deu errado",
          })
        },
      },
    )
  }

  const initials = getUserInitials(profile.name)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize suas informações pessoais e como você aparece para outros usuários</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Avatar className="h-24 w-24">
            <AvatarImage src={getProfilePicUrl(session?.picture) || ""} alt={profile.name || "Avatar"} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <ProfileImageUpload />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Input name="name" label="Nome" placeholder="Seu nome" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Input
                type="text"
                name="enrollmentNumber"
                label="Matrícula"
                placeholder="Número de matrícula"
                maxLength={10}
                description="Número de matrícula fornecido pela instituição"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />

              {courses && courses.length > 0 && (
                <Select
                  name="courseId"
                  label="Curso"
                  placeholder="Selecione seu curso"
                  options={courses.map((course) => ({
                    value: course.id,
                    label: course.code,
                  }))}
                />
              )}
            </div>

            <div>
              <MarkdownEditor name="about" label="Sobre mim" placeholder="Escreva um pouco sobre você..." />
            </div>

            <div className="flex justify-end">
              <SubmitButton>{isPending ? "Salvando..." : "Salvar alterações"}</SubmitButton>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
