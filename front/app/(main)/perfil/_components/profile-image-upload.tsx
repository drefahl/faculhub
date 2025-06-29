"use client"

import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { uploadProfileImage, useDeleteProfileImage } from "@/lib/api/react-query/user"
import { Trash2, Upload } from "lucide-react"
import type React from "react"
import { useRef, useState } from "react"
import { toast } from "sonner"

export function ProfileImageUpload() {
  const [isUploading, setIsUploading] = useState(false)

  const { refreshSession } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: removeImage, isPending: isRemoving } = useDeleteProfileImage()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de arquivo inválido", {
        description: "Por favor, selecione uma imagem (JPEG, PNG, GIF ou WEBP).",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande", { description: "O tamanho máximo permitido é 5MB." })
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setIsUploading(true)

      await uploadProfileImage({ data: formData })
      await refreshSession()
      toast.success("Imagem atualizada", { description: "Sua foto de perfil foi atualizada com sucesso." })

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      toast.error("Erro ao fazer upload", { description: "Erro ao fazer upload da imagem" })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    removeImage(undefined, {
      onSuccess: async () => {
        await refreshSession()
        toast.success("Imagem removida", { description: "Sua foto de perfil foi removida com sucesso." })
      },
      onError: (error) => {
        toast.error("Erro ao remover imagem", { description: error.message || "Erro ao remover a imagem" })
      },
    })
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Enviando..." : "Alterar foto"}
        </Button>

        <Button type="button" variant="outline" size="sm" disabled={isRemoving} onClick={handleRemoveImage}>
          <Trash2 className="mr-2 h-4 w-4" />
          {isRemoving ? "Removendo..." : "Remover"}
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
      />
      <p className="text-xs text-muted-foreground">JPG, PNG, GIF ou WEBP. Máximo 5MB.</p>
    </div>
  )
}
