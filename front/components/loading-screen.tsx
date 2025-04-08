import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingScreen({ message = "Carregando conteúdo...", fullScreen = false }: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? "min-h-screen" : "min-h-[200px]"}`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-12 w-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-primary opacity-20" />
        </div>
        <p className="text-center text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
