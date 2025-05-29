"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/utils/token"
import { getProfilePicUrl, getUserInitials } from "@/lib/utils/user.utils"
import { sendGAEvent } from "@next/third-parties/google"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "./providers/session-provider"

export function UserAccountNav() {
  const { session } = useSession()
  const router = useRouter()

  if (!session?.id) {
    return (
      <div className="flex gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-xs sm:text-sm px-2 sm:px-3"
          onClick={() => sendGAEvent("event", "login_started", { method: "link" })}
        >
          <Link href="/login">Entrar</Link>
        </Button>

        <Button
          size="sm"
          asChild
          className="text-xs sm:text-sm px-2 sm:px-3"
          onClick={() => sendGAEvent("event", "sign_up_started", {})}
        >
          <Link href="/register">Registrar</Link>
        </Button>
      </div>
    )
  }

  const { name, email, picture } = session
  const initials = getUserInitials(name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getProfilePicUrl(picture) || ""} alt={name || "Avatar"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {name && <p className="font-medium">{name}</p>}
            {email && <p className="w-[200px] truncate text-sm text-muted-foreground">{email}</p>}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2"
          onSelect={async (event) => {
            event.preventDefault()
            sendGAEvent("event", "logout", {})
            await signOut()
            router.refresh()
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
